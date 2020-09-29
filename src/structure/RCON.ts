import { EventEmitter } from 'events';
import resolveSRV, { SRVRecord } from '../util/resolveSRV';
import TCPSocket from './TCPSocket';
import Packet from './Packet';
import { RCONOptions } from '../model/Options';

const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;

interface RCONEvents {
	on(event: 'output', listener: (output: string) => void): void;
}

function applyDefaultOptions(options?: RCONOptions): Required<RCONOptions> {
	// Apply the provided options on the default options
	return Object.assign({
		port: 25575,
		password: '',
		timeout: 1000 * 15,
		enableSRV: true
	} as Required<RCONOptions>, options);
}

/**
 * A utility class for executing commands remotely on a Minecraft server.
 * @class
 * @extends {EventEmitter}
 * @implements {RCONEvents}
 */
class RCON extends EventEmitter implements RCONEvents {
	private host: string;
	private isLoggedIn: boolean;
	private options: Required<RCONOptions>;
	private socket: TCPSocket | null = null;
	private requestID: number;

	/**
	 * Creates a new RCON class with the host and options
	 * @param {string} host The host of the server
	 * @param {RCONOptions} options The options for the RCON client
	 * @constructor
	 */
	constructor(host: string, options?: RCONOptions) {
		super();

		const opts = applyDefaultOptions(options);

		this.host = host;
		this.isLoggedIn = false;
		this.options = opts;
		this.requestID = 0;
	}

	/**
	 * Connects to the server using TCP and sends the correct login packets.
	 * @returns {Promise<void>} A Promise that resolves when it has successfully logged in
	 * @async
	 */
	async connect(): Promise<void> {
		let srvRecord: SRVRecord | null = null;

		// Automatically resolve a connectable address from a known address using SRV DNS records
		if (this.options.enableSRV && !ipAddressRegEx.test(this.host)) {
			srvRecord = await resolveSRV(this.host);

			if (srvRecord) {
				this.options.port = srvRecord.port;
			}
		}

		// Create a TCP connection to the server and wait for it to connect
		this.socket = await TCPSocket.connect(this.host, this.options.port, this.options.timeout);

		{
			// Create a login packet and send it to the server
			// https://wiki.vg/RCON#3:_Login
			const loginPacket = new Packet();
			loginPacket.writeIntLE(10 + this.options.password.length);
			loginPacket.writeIntLE(++this.requestID);
			loginPacket.writeIntLE(3);
			loginPacket.writeString(this.options.password, false);
			loginPacket.writeByte(0x00, 0x00);
			await this.socket.writePacket(loginPacket, false);
		}

		{
			// Wait for the next packet back, determine if the login was successful
			const length = await this.socket.readIntLE();
			const requestID = await this.socket.readIntLE();
			await this.socket.readIntLE();

			if (requestID === -1) {
				throw new Error('Failed to connect to RCON, invalid password');
			}

			await this.socket.readBytes(length - 8);

			this.isLoggedIn = true;
		}

		process.nextTick(async () => {
			while (this.socket !== null) {
				const length = await this.socket.readIntLE();
				await this.socket.readIntLE();
				const packetType = await this.socket.readIntLE();

				if (packetType === 0) {
					let output = '';

					if (length > 10) {
						output = String.fromCodePoint(...await this.socket.readBytes(length - 10));
					}

					this.emit('output', output);

					await this.socket.readBytes(2);
				} else {
					await this.socket.readBytes(length - 8); // Discard the rest of the unknown packet
				}
			}
		});
	}

	/**
	 * Executes commands on the server after it has successfully logged in
	 * @param {string} command The command to execute
	 * @returns {Promise<void>} The Promise that resolves whenever the command has executed
	 * @async
	 */
	async run(command: string): Promise<void> {
		if (this.socket === null || this.socket.socket.connecting) {
			throw new Error('Socket has not connected yet, please run RCON#connect()');
		}

		if (!this.isLoggedIn) {
			throw new Error('Client is not logged in or login was unsuccessful, please run RCON#connect()');
		}

		const commandPacket = new Packet();
		commandPacket.writeIntLE(10 + command.length);
		commandPacket.writeIntLE(++this.requestID);
		commandPacket.writeIntLE(2);
		commandPacket.writeString(command, false);
		commandPacket.writeByte(0x00, 0x00);
		return this.socket.writePacket(commandPacket, false);
	}

	/**
	 * Closes the connection to the server
	 * @returns {Promise<void>} A Promise that resolves when the connection has closed
	 * @async
	 */
	close(): Promise<void> {
		if (this.socket === null) {
			throw new Error('Socket is already closed');
		}

		return this.socket.destroy();
	}
}

export { RCON };