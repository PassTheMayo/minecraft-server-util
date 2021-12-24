import assert from 'assert';
import { EventEmitter } from 'events';
import { NetConnectOpts } from 'net';
import { TextEncoder } from 'util';
import TCPClient from './TCPClient';

const encoder = new TextEncoder();

export interface RCONLoginOptions {
	timeout?: number
}

export interface Message {
	requestID: number,
	message: string
}

export interface RCONEvents {
	on(event: 'message', listener: (data: Message) => void): void
	once(event: 'message', listener: (data: Message) => void): void
	emit(event: 'message', value: Message): void
}

class RCON extends EventEmitter implements RCONEvents {
	public isLoggedIn = false;
	private socket: TCPClient | null = null;
	private requestID = 0;

	constructor() {
		super();
	}

	get isConnected() {
		return this.socket && this.socket.isConnected || false;
	}

	connect(host: string, port = 25575, options: Partial<NetConnectOpts> = {}): Promise<void> {
		assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
		assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
		assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
		assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
		assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
		assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
		assert(typeof options === 'object', `Expected 'options' to be an 'object', got '${typeof options}'`);

		return new Promise((resolve, reject) => {
			this.socket = new TCPClient();

			const timeout = setTimeout(() => {
				reject(new Error('Failed to connect to RCON server within timeout duration'));

				this.socket?.close();
			}, options?.timeout ?? 1000 * 5);

			this.socket.connect({ host, port, ...options })
				.then(() => {
					clearTimeout(timeout);

					resolve();
				})
				.catch((error) => {
					clearTimeout(timeout);

					reject(error);
				});
		});
	}

	login(password: string, options: RCONLoginOptions = {}): Promise<void> {
		assert(typeof password === 'string', `Expected 'password' to be a 'string', got '${typeof password}'`);
		assert(password.length > 1, `Expected 'password' to have a length greater than 0, got ${password.length}`);
		assert(typeof options === 'object', `Expected 'options' to be an 'object', got '${typeof options}'`);

		return new Promise(async (resolve, reject) => {
			if (this.socket === null || !this.socket.isConnected) return reject(new Error('login() attempted before RCON has connected'));

			const timeout = setTimeout(() => {
				reject(new Error('Failed to connect to RCON server within timeout duration'));

				this.socket?.close();
			}, options?.timeout ?? 1000 * 5);

			this.isLoggedIn = false;

			const passwordBytes = encoder.encode(password);

			// Login packet
			// https://wiki.vg/RCON#3:_Login
			{
				this.socket.writeInt32LE(10 + passwordBytes.byteLength);
				this.socket.writeInt32LE(this.requestID++);
				this.socket.writeInt32LE(3);
				this.socket.writeBytes(passwordBytes);
				this.socket.writeBytes(Uint8Array.from([0x00, 0x00]));
				await this.socket.flush(false);
			}

			// Login response packet
			// https://wiki.vg/RCON#3:_Login
			{
				const packetLength = await this.socket.readInt32LE();
				this.socket.ensureBufferedData(packetLength);

				const requestID = await this.socket.readInt32LE();
				if (requestID === -1) throw new Error('Invalid RCON password');

				const packetType = await this.socket.readInt32LE();
				if (packetType !== 2) throw new Error('Expected server to send packet type 2, received ' + packetType);

				await this.socket.readBytes(2);
			}

			this.isLoggedIn = true;

			clearTimeout(timeout);

			resolve();

			process.nextTick(async () => {
				while (this.socket !== null && this.socket.isConnected && this.isLoggedIn) {
					try {
						await this._readPacket();
					} catch (e) {
						this.emit('error', e);
					}
				}
			});
		});
	}

	async run(command: string): Promise<number> {
		assert(typeof command === 'string', `Expected 'command' to be a 'string', got '${typeof command}'`);
		assert(command.length > 1, `Expected 'command' to have a length greater than 0, got ${command.length}`);

		if (this.socket === null || !this.socket.isConnected) throw new Error('run() attempted before RCON has connected');
		if (!this.isLoggedIn) throw new Error('run() attempted before RCON has successfully logged in');

		const commandBytes = encoder.encode(command);
		const requestID = this.requestID++;

		this.socket.writeInt32LE(10 + commandBytes.byteLength);
		this.socket.writeInt32LE(requestID);
		this.socket.writeInt32LE(2);
		this.socket.writeBytes(commandBytes);
		this.socket.writeBytes(Uint8Array.from([0x00, 0x00]));
		await this.socket.flush(false);

		return requestID;
	}

	async execute(command: string): Promise<string> {
		assert(typeof command === 'string', `Expected 'command' to be a 'string', got '${typeof command}'`);
		assert(command.length > 1, `Expected 'command' to have a length greater than 0, got ${command.length}`);

		const requestID = await this.run(command);

		return new Promise((resolve) => {
			const listenerFunc = (data: Message) => {
				if (data.requestID !== requestID) return;

				this.removeListener('message', listenerFunc);

				resolve(data.message);
			};

			this.on('message', listenerFunc);
		});
	}

	async _readPacket(): Promise<void> {
		if (this.socket === null || !this.socket.isConnected || !this.isLoggedIn) return Promise.reject(new Error('Attempted to read packet when socket was disconnected or RCON was not logged in'));

		const packetLength = await this.socket.readInt32LE();
		await this.socket.ensureBufferedData(packetLength);

		const requestID = await this.socket.readInt32LE();
		const packetType = await this.socket.readInt32LE();

		if (packetType === 0) {
			const message = await this.socket.readStringNT();

			await this.socket.readBytes(1);

			this.emit('message', { requestID, message });
		} else {
			await this.socket.readBytes(packetLength - 8);
		}
	}

	close(): void {
		this.socket?.close();
	}
}

export { RCON };