import assert from 'assert';
import { randomBytes } from 'crypto';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import UDPClient from './structure/UDPClient';
import { BedrockStatusOptions } from './types/BedrockStatusOptions';
import { BedrockStatusResponse } from './types/BedrockStatusResponse';
import { resolveUDPSRV } from './util/srvRecord';

export async function statusBedrock(host: string, port = 19132, options?: BedrockStatusOptions): Promise<BedrockStatusResponse> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an 'object' or 'undefined', got '${typeof options}'`);

	let srvRecord = null;

	if (typeof options === 'undefined' || typeof options.enableSRV === 'undefined' || options.enableSRV) {
		srvRecord = await resolveUDPSRV(host);

		if (srvRecord) {
			host = srvRecord.host;
			port = srvRecord.port;
		}
	}

	const socket = new UDPClient(host, port);

	try {
		// Unconnected ping packet
		// https://wiki.vg/Raknet_Protocol#Unconnected_Ping
		{
			socket.writeByte(0x01);
			socket.writeInt64BE(BigInt(Date.now()));
			socket.writeBytes(Uint8Array.from([0x00, 0xff, 0xff, 0x00, 0xfe, 0xfe, 0xfe, 0xfe, 0xfd, 0xfd, 0xfd, 0xfd, 0x12, 0x34, 0x56, 0x78]));
			socket.writeBytes(randomBytes(4));
			await socket.flush(false);
		}

		// Unconnected pong packet
		// https://wiki.vg/Raknet_Protocol#Unconnected_Pong
		{
			const packetType = await socket.readByte();
			if (packetType !== 0x1C) throw new Error('Expected server to send packet type 0x1C, received ' + packetType);

			await socket.readInt64BE();

			const serverGUID = await socket.readInt64BE();

			await socket.readBytes(16);

			const responseLength = await socket.readInt16BE();
			const response = await socket.readString(responseLength);

			const [edition, motdLine1, protocolVersion, version, onlinePlayers, maxPlayers, serverID, motdLine2, gameMode, gameModeID, portIPv4, portIPv6] = response.split(';');

			const motd = parse(motdLine1 + '\n' + motdLine2);

			return {
				edition,
				motd: {
					raw: format(motd),
					clean: clean(motd),
					html: toHTML(motd)
				},
				version: {
					name: version,
					protocol: parseInt(protocolVersion)
				},
				players: {
					online: parseInt(onlinePlayers),
					max: parseInt(maxPlayers)
				},
				serverGUID,
				serverID,
				gameMode,
				gameModeID: parseInt(gameModeID),
				portIPv4: parseInt(portIPv4),
				portIPv6: parseInt(portIPv6),
				srvRecord
			};
		}
	} finally {
		socket.close();
	}
}