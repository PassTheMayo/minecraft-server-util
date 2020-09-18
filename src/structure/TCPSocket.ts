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

	// Connects to the server using a TCP socket
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

	// Reads a byte (uint8) from the stream
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

	// Reads multiple bytes (uint[]) from the stream
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

	// Reads a varint (variable sized integer) from the stream
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

	// Reads a short (int16) from the stream
	async readShort(): Promise<number> {
		const data = await this.readBytes(2);

		return (data[0] << 8) | data[1];
	}

	// Reads a short (int16, little endian) from the stream
	async readIntLE(): Promise<number> {
		const data = await this.readBytes(4);

		return data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
	}

	// Writes multiple bytes (uint8[]) to the stream
	writeBytes(buffer: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.write(buffer, (error) => {
				if (error) { return reject(error); }

				resolve();
			});
		});
	}

	// Writes the packet to the stream
	writePacket(packet: Packet, prefixLength: boolean): Promise<void> {
		if (prefixLength) {
			const finalPacket = new Packet();
			finalPacket.writeVarInt(packet.data.length);
			finalPacket.writeByte(...packet.data);

			return this.writeBytes(Buffer.from(finalPacket.data));
		}

		return this.writeBytes(Buffer.from(packet.data));
	}

	// Closes the stream and destroys all event listeners
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