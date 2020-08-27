const assert = require('assert');
const net = require('net');

class Socket {
	constructor(host, port, timeout) {
		assert(typeof host === 'string', 'Expected string, got ' + (typeof host));
		assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
		assert(typeof port === 'number', 'Expected number, got ' + (typeof port));
		assert(Number.isInteger(port), 'Expected integer, got ' + port);
		assert(port > 0, 'Expected port > 0, got ' + port);
		assert(port < 65536, 'Expected port < 65536, got ' + port);
		assert(typeof timeout === 'number', 'Expected number, got ' + (typeof timeout));
		assert(timeout > 0, 'Expected timeout > 0, got ' + timeout);

		this.socket = net.createConnection({ host, port });
		this.socket.setTimeout(timeout);

		this.socket.on('data', (data) => {
			this.buffer.push(...data);
		});

		this.isConnected = false;
		this.buffer = [];
	}

	waitUntilConnected() {
		if (this.isConnected) return Promise.resolve();

		return new Promise((resolve, reject) => {
			let connected = false;

			this.socket.on('connect', () => {
				if (connected) return;

				this.isConnected = true;
				connected = true;

				resolve();
			});

			this.socket.on('end', (error) => {
				if (connected) return;

				this.isConnected = false;

				reject(error);
			});

			this.socket.on('error', (error) => {
				if (connected) return;

				this.isConnected = false;

				this.socket.end();

				reject(error);
			});
		});
	}

	readByte() {
		if (this.buffer.length > 0) return Promise.resolve(this.buffer.shift());

		return new Promise((resolve) => {
			let read = false;

			this.socket.on('data', () => {
				if (read) return;

				process.nextTick(() => {
					if (this.buffer.length > 0) {
						read = true;

						return resolve(this.buffer.shift());
					}
				});
			});
		});
	}

	readBytes(length) {
		if (this.buffer.length >= length) {
			const value = this.buffer.slice(0, length);
			this.buffer.splice(0, length);
			return Promise.resolve(value);
		}

		return new Promise((resolve) => {
			let read = false;

			this.socket.on('data', () => {
				if (read) return;

				process.nextTick(() => {
					if (this.buffer.length >= length) {
						read = true;

						const value = this.buffer.slice(0, length);
						this.buffer.splice(0, length);
						return resolve(value);
					}
				});
			});
		});
	}

	writeByte(value) {
		return new Promise((resolve, reject) => {
			this.socket.write(Buffer.from([value]), (error) => {
				if (error) return reject(error);

				resolve();
			});
		});
	}

	writeBytes(buffer) {
		return new Promise((resolve, reject) => {
			this.socket.write(buffer, (error) => {
				if (error) return reject(error);

				resolve();
			});
		});
	}

	readVarInt() {
		return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
			let numRead = 0;
			let result = 0;
			let read, value;

			do {
				if (numRead >= 5) return reject(new Error('VarInt exceeds data bounds'));

				read = await this.readByte();
				value = (read & 0b01111111);
				result |= (value << (7 * numRead));

				numRead++;

				if (numRead > 5) {
					return reject(new Error('VarInt is too big'));
				}
			} while ((read & 0b10000000) != 0);

			resolve(result);
		});
	}

	async readString() {
		const length = await this.readVarInt();
		const data = await this.readBytes(length);

		let value = '';

		for (let i = 0; i < data.length; i++) {
			value += String.fromCharCode(data[i]);
		}

		return Promise.resolve(value);
	}

	destroy() {
		this.socket.removeAllListeners();
		this.socket.destroy();
	}
}

module.exports = Socket;