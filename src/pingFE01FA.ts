import assert from 'assert';
import Packet from './structure/Packet';
import Socket from './structure/Socket';
import formatResultFE01FA from './util/formatResultFE01FA';
import resolveSRV, { SRVRecord } from './util/resolveSRV';
import { Response } from './model/Response';
import decodeUTF16BE from './util/decodeUTF16BE';

const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;

interface Options {
	port?: number,
	protocolVersion?: number,
	pingTimeout?: number,
	enableSRV?: boolean
}

function applyDefaultOptions(options?: Options): Required<Options> {
	// Apply the provided options on the default options
	return Object.assign({
		port: 25565,
		protocolVersion: 47,
		pingTimeout: 1000 * 5,
		enableSRV: true
	} as Required<Options>, options);
}

// Pings the server using the 1.6 ping format
async function pingFE01FA(host: string, options?: Options): Promise<Response> {
	// Applies the provided options on top of the default options
	const opts = applyDefaultOptions(options);

	// Assert that the arguments are the correct type and format
	assert(typeof host === 'string', `Expected 'host' to be a string, got ${typeof host}`);
	assert(host.length > 0, 'Expected \'host\' to have content, got an empty string');
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an object or undefined, got ${typeof options}`);
	assert(typeof opts === 'object', `Expected 'options' to be an object, got ${typeof opts}`);
	assert(typeof opts.port === 'number', `Expected 'options.port' to be a number, got ${typeof opts.port}`);
	assert(opts.port > 0, `Expected 'options.port' to be greater than 0, got ${opts.port}`);
	assert(opts.port < 65536, `Expected 'options.port' to be less than 65536, got ${opts.port}`);
	assert(Number.isInteger(opts.port), `Expected 'options.port' to be an integer, got ${opts.port}`);
	assert(typeof opts.protocolVersion === 'number', `Expected 'options.protocolVersion' to be a number, got ${typeof opts.protocolVersion}`);
	assert(opts.protocolVersion >= 0, `Expected 'options.protocolVersion' to be greater than or equal to 0, got ${opts.protocolVersion}`);
	assert(Number.isInteger(opts.protocolVersion), `Expected 'options.protocolVersion' to be an integer, got ${opts.protocolVersion}`);
	assert(typeof opts.pingTimeout === 'number', `Expected 'options.pingTimeout' to be a number, got ${typeof opts.pingTimeout}`);
	assert(opts.pingTimeout > 0, `Expected 'options.pingTimeout' to be greater than 0, got ${opts.pingTimeout}`);
	assert(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);

	let srvRecord: SRVRecord | null = null;

	// Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
	if (opts.enableSRV && !ipAddressRegEx.test(host)) {
		srvRecord = await resolveSRV(host);
	}

	// Create a new TCP connection to the specified address
	const socket = await Socket.connect(srvRecord?.host ?? host, opts.port, opts.pingTimeout);

	// Create the necessary packets and send them to the server
	{
		// https://wiki.vg/Server_List_Ping#Client_to_server
		const packet = new Packet();
		packet.writeByte(0xFE, 0x01, 0xFA, 0x00, 0x0B, 0x00, 0x4D, 0x00, 0x43, 0x00, 0x7C, 0x00, 0x50, 0x00, 0x69, 0x00, 0x6E, 0x00, 0x67, 0x00, 0x48, 0x00, 0x6F, 0x00, 0x73, 0x00, 0x74);
		packet.writeShort(7 + host.length);
		packet.writeByte(opts.protocolVersion);
		packet.writeShort(host.length);
		packet.writeString(host, false);
		packet.writeInt(opts.port);
		socket.writePacket(packet, false);
	}

	let protocolVersion = 0;
	let serverVersion = '';
	let motd = '';
	let playerCount = 0;
	let maxPlayers = 0;

	{
		const packetType = await socket.readByte();

		// Packet was unexpected type, ignore the rest of the data in this packet
		if (packetType !== 0xFF) throw new Error('Packet returned from server was unexpected type');

		// Read the length of the data string
		const length = await socket.readShort();

		// Read all of the data string and convert to a UTF-8 string
		const data = decodeUTF16BE(String.fromCodePoint(...(await socket.readBytes(length * 2)).slice(6)));

		const [protocolVersionStr, serverVersionStr, motdStr, playerCountStr, maxPlayersStr] = data.split('\0');

		protocolVersion = parseInt(protocolVersionStr);
		serverVersion = serverVersionStr;
		motd = motdStr;
		playerCount = parseInt(playerCountStr);
		maxPlayers = parseInt(maxPlayersStr);

		if (isNaN(protocolVersion)) throw new Error('Server returned an invalid protocol version: ' + protocolVersionStr);
		if (isNaN(playerCount)) throw new Error('Server returned an invalid player count: ' + playerCountStr);
		if (isNaN(maxPlayers)) throw new Error('Server returned an invalid max player count: ' + maxPlayersStr);
	}

	// Destroy the socket, it is no longer needed
	socket.destroy();

	// Convert the data from raw Minecraft ping payload format into a more human readable format and resolve the promise
	return formatResultFE01FA(host, opts.port, srvRecord, protocolVersion, serverVersion, motd, playerCount, maxPlayers);
}

export default pingFE01FA;