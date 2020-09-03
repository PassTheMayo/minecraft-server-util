import assert from 'assert';
import net from 'net';
import Packet from './Packet';

class TCPSocket {
	public socket: net.Socket;
	public isConnected = false;
	private buffer: number[] = [];

	constructor(socket: net.Socket) {
		this.socket = socket;

		socket.on('data', (data) => {
			this.buffer.push(...Array.from(data));
		});
	}

	static connect(host: string, port: number, timeout: number): Promise<TCPSocket> {
		assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
		assert(Number.isInteger(port), 'Expected integer, got ' + port);
		assert(port > 0, 'Expected port > 0, got ' + port);
		assert(port < 65536, 'Expected port < 65536, got ' + port);
		assert(timeout > 0, 'Expected timeout > 0, got ' + timeout);

		const socket = net.createConnection({ host, port, timeout });

		return new Promise((resolve, reject) => {
			const connectHandler = () => {
				resolve(new TCPSocket(socket));

				socket.removeListener('connect', connectHandler);
			};

			const closeHandler = () => {
				reject();

				socket.removeListener('close', closeHandler);
			};

			const endHandler = () => {
				reject();

				socket.removeListener('end', endHandler);
			};

			const errorHandler = (error: Error) => {
				reject(error);

				socket.removeListener('error', errorHandler);
			};

			const timeoutHandler = () => {
				reject();

				socket.removeListener('timeout', timeoutHandler);
			};

			socket.on('connect', connectHandler);
			socket.on('close', closeHandler);
			socket.on('end', endHandler);
			socket.on('error', errorHandler);
			socket.on('timeout', timeoutHandler);
		});
	}

	readByte(): Promise<number> {
		if (this.buffer.length > 0) { return Promise.resolve(this.buffer.shift() || 0); }

		return new Promise((resolve) => {
			let read = false;

			const dataHandler = () => {
				if (read) { return; }

				process.nextTick(() => {
					if (this.buffer.length > 0) {
						read = true;

						this.socket.removeListener('data', dataHandler);

						return resolve(this.buffer.shift());
					}
				});
			};

			this.socket.on('data', dataHandler);
		});
	}

	readBytes(length: number): Promise<number[]> {
		if (this.buffer.length >= length) {
			const value = this.buffer.slice(0, length);
			this.buffer.splice(0, length);
			return Promise.resolve(value);
		}

		return new Promise((resolve) => {
			let read = false;

			const dataHandler = () => {
				if (read) {
					return;
				}

				process.nextTick(() => {
					if (this.buffer.length >= length) {
						read = true;

						this.socket.removeListener('data', dataHandler);

						const value = this.buffer.slice(0, length);
						this.buffer.splice(0, length);
						return resolve(value);
					}
				});
			};

			this.socket.on('data', dataHandler);
		});
	}

	async readVarInt(): Promise<number> {
		let numRead = 0;
		let result = 0;
		let read: number, value: number;

		do {
			if (numRead > 4) { throw new Error('VarInt exceeds data bounds'); }

			read = await this.readByte();
			value = (read & 0b01111111);
			result |= (value << (7 * numRead));

			numRead++;

			if (numRead > 5) {
				throw new Error('VarInt is too big');
			}
		} while ((read & 0b10000000) != 0);

		return result;
	}

	async readString(): Promise<string> {
		const length = await this.readVarInt();
		const data = await this.readBytes(length);

		let value = '';

		for (let i = 0; i < data.length; i++) {
			value += String.fromCharCode(data[i]);
		}

		return value;
	}

	async readShort(): Promise<number> {
		const data = await this.readBytes(2);

		return (data[0] << 8) | data[1];
	}

	async readInt(): Promise<number> {
		const data = await this.readBytes(4);

		return (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
	}

	async readIntLE(): Promise<number> {
		const data = await this.readBytes(4);

		return data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
	}

	async readLong(): Promise<number> {
		const data = await this.readBytes(8);

		return (data[0] << 56) | (data[1] << 48) | (data[2] << 40) | (data[3] << 32) | (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
	}

	writeByte(value: number): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.write(Buffer.from([value]), (error) => {
				if (error) { return reject(error); }

				resolve();
			});
		});
	}

	writeBytes(buffer: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.write(buffer, (error) => {
				if (error) { return reject(error); }

				resolve();
			});
		});
	}

	writePacket(packet: Packet, prefixLength: boolean): Promise<void> {
		if (prefixLength) {
			const finalPacket = new Packet();
			finalPacket.writeVarInt(packet.data.length);
			finalPacket.writeByte(...packet.data);

			return this.writeBytes(Buffer.from(finalPacket.data));
		}

		return this.writeBytes(Buffer.from(packet.data));
	}

	destroy(): Promise<void> {
		return new Promise((resolve) => {
			this.socket.removeAllListeners();
			this.socket.end(() => {
				resolve();

				this.socket.destroy();
			});
		});
	}
}

export default TCPSocket;