import assert from 'assert';
import Packet from './structure/Packet';
import Socket from './structure/Socket';
import getVarIntSize from './util/getVarIntSize';
import formatResult from './util/formatResult';
import resolveSRV, { SRVRecord } from './util/resolveSRV';
import { Response } from './model/Response';
import { RawResponse } from './model/RawResponse';

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

// Pings the server using the new 1.7+ ping format
async function ping(host: string, options?: Options): Promise<Response> {
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
		// https://wiki.vg/Server_List_Ping#Handshake
		const handshakePacket = new Packet();
		handshakePacket.writeVarInt(0x00);
		handshakePacket.writeVarInt(opts.protocolVersion);
		handshakePacket.writeString(host, true);
		handshakePacket.writeShort(opts.port);
		handshakePacket.writeVarInt(1);
		socket.writePacket(handshakePacket, true);

		// https://wiki.vg/Server_List_Ping#Request
		const requestPacket = new Packet();
		requestPacket.writeVarInt(0x00);
		socket.writePacket(requestPacket, true);
	}

	let data: string | null = null;

	// Loop over each packet returned and wait until it receives a Response packet
	// https://wiki.vg/Server_List_Ping#Response
	for (let i = 0; i < 3; i++) {
		const packetLength = await socket.readVarInt();
		const packetType = await socket.readVarInt();

		// Packet was unexpected type, ignore the rest of the data in this packet
		if (packetType !== 0) {
			const readSize = packetLength - getVarIntSize(packetType);

			if (readSize > 0) await socket.readBytes(readSize);

			continue;
		}

		// Packet was expected type, read the contents of the packet for the ping data
		data = await socket.readString();

		break;
	}

	// Destroy the socket, it is no longer needed
	socket.destroy();

	if (data === null) throw new Error('Failed to recieve correct packet within 3 attempts');

	// Convert the raw JSON string provided by the server into a JavaScript object
	let result: RawResponse;

	try {
		result = JSON.parse(data);
	} catch (e) {
		throw new Error('Response from server is not valid JSON');
	}

	// Convert the data from raw Minecraft ping payload format into a more human readable format and resolve the promise
	return formatResult(host, opts.port, srvRecord, result);
}

export default ping;