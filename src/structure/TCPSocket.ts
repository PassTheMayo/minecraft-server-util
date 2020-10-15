import assert from 'assert';
import net from 'net';
import Packet from './Packet';

/**
 * A TCP socket utility class for easily interacting with remote sockets.
 * @class
 */
class TCPSocket {
	/**
	 * The raw TCP socket provided by Node.js methods.
	 * @type {net.Socket}
	 */
	public socket: net.Socket;
	/**
	 * A boolean that indicates whether the socket is connected or not.
	 * @type {boolean}
	 */
	public isConnected = false;
	private buffer: number[] = [];

	/**
	 * Creates a new TCP socket class from the existing connection.
	 * @param {net.Socket} socket The existing TCP connection
	 * @constructor
	 */
	constructor(socket: net.Socket) {
		this.socket = socket;

		socket.on('data', (data) => {
			this.buffer.push(...Array.from(data));
		});
	}

	/**
	 * Automatically connects to the server using the host and port.
	 * @param {string} host The host of the server
	 * @param {number} port The port of the server
	 * @param {number} timeout The timeout in milliseconds
	 * @returns {Promise<TCPSocket>} A Promise that resolves to the TCP socket
	 * @async
	 */
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

	/**
	 * Reads a byte from the stream.
	 * @returns {Promise<number>} The byte read from the stream
	 * @async
	 */
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

	/**
	 * Read bytes from the stream.
	 * @param {number} length The amount of bytes to read
	 * @returns {Promise<number[]>} The bytes read from the stream
	 * @async
	 */
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

	/**
	 * Read a varint from the stream.
	 * @returns {Promise<number>} The varint read from the stream
	 * @async
	 */
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

	/**
	 * Reads a short (int16, big-endian) from the stream.
	 * @returns {Promise<number>} The int16 read from the stream
	 * @async
	 */
	async readShort(): Promise<number> {
		const data = await this.readBytes(2);

		return (data[0] << 8) | data[1];
	}

	/**
	 * Reads a short (int16, little-endian) from the stream.
	 * @returns {Promise<number>} The int16 read from the stream
	 * @async
	 */
	async readIntLE(): Promise<number> {
		const data = await this.readBytes(4);

		return data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
	}

	/**
	 * Writes bytes to the stream.
	 * @param {Buffer} buffer The buffer to write to the stream.
	 * @returns {Promise<void>} The Promise that resolves when it has successfully written the data
	 * @async
	 */
	writeBytes(buffer: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.write(buffer, (error) => {
				if (error) { return reject(error); }

				resolve();
			});
		});
	}

	/**
	 * Writes a {@see Packet} to the stream.
	 * @param {Packet} packet The Packet to write to the stream
	 * @param {boolean} [prefixLength=true] Write the packet length as a prefix as a varint
	 * @returns {Promise<void>} The Promise that resolves when the packet has been written
	 * @async
	 */
	writePacket(packet: Packet, prefixLength = true): Promise<void> {
		if (prefixLength) {
			const finalPacket = new Packet();
			finalPacket.writeVarInt(packet.data.length);
			finalPacket.writeByte(...packet.data);

			return this.writeBytes(Buffer.from(finalPacket.data));
		}

		return this.writeBytes(Buffer.from(packet.data));
	}

	/**
	 * Closes the stream and cleans up data.
	 * @returns {Promise<void>} The Promise that resolves when the connection has closed
	 * @async
	 */
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