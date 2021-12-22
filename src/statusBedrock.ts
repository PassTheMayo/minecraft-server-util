import assert from 'assert';
import { randomBytes } from 'crypto';
import { clean, format, parse, toHTML } from 'minecraft-motd-util';
import UDPClient from './structure/UDPClient';
import { BedrockStatusOptions } from './types/BedrockStatusOptions';
import { BedrockStatusResponse } from './types/BedrockStatusResponse';
import { resolveSRV } from './util/srvRecord';

export function statusBedrock(host: string, port = 19132, options?: BedrockStatusOptions): Promise<BedrockStatusResponse> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an 'object' or 'undefined', got '${typeof options}'`);

	if (typeof options === 'object') {
		assert(typeof options.enableSRV === 'boolean' || typeof options.enableSRV === 'undefined', `Expected 'options.enableSRV' to be a 'boolean' or 'undefined', got '${typeof options.enableSRV}'`);
		assert(typeof options.timeout === 'number' || typeof options.timeout === 'undefined', `Expected 'options.timeout' to be a 'number' or 'undefined', got '${typeof options.timeout}'`);

		if (typeof options.timeout === 'number') {
			assert(Number.isInteger(options.timeout), `Expected 'options.timeout' to be an integer, got '${options.timeout}'`);
			assert(options.timeout >= 0, `Expected 'options.timeout' to be greater than or equal to 0, got '${options.timeout}'`);
		}
	}

	return new Promise(async (resolve, reject) => {
		const socket = new UDPClient(host, port);

		const timeout = setTimeout(() => {
			socket?.close();

			reject(new Error('Timed out while retrieving server status'));
		}, options?.timeout ?? 1000 * 5);

		try {
			let srvRecord = null;

			if (typeof options === 'undefined' || typeof options.enableSRV === 'undefined' || options.enableSRV) {
				srvRecord = await resolveSRV(host, 'udp');

				if (srvRecord) {
					host = srvRecord.host;
					port = srvRecord.port;
				}
			}

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

				socket.close();

				clearTimeout(timeout);

				resolve({
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
					portIPv4: portIPv4 ? parseInt(portIPv4) : null,
					portIPv6: portIPv6 ? parseInt(portIPv6) : null,
					srvRecord
				});
			}
		} catch (e) {
			clearTimeout(timeout);

			socket?.close();

			reject(e);
		}
	});
}