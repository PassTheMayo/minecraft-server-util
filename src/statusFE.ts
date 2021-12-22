import assert from 'assert';
import TCPClient from './structure/TCPClient';
import { JavaStatusOptions } from './types/JavaStatusOptions';
import { JavaStatusFEResponse } from './types/JavaStatusFEResponse';
import { resolveSRV } from './util/srvRecord';

/**
 * @deprecated
 */
export function statusFE(host: string, port = 25565, options?: JavaStatusOptions): Promise<JavaStatusFEResponse> {
	process.emitWarning('Use of statusFE() has been deprecated since 5.2.0 in favor of a statusLegacy(). This method will be removed during the next major release of the minecraft-server-util library.', 'DeprecationWarning');

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
		const socket = new TCPClient();

		const timeout = setTimeout(() => {
			socket?.close();

			reject(new Error('Timed out while retrieving server status'));
		}, options?.timeout ?? 1000 * 5);

		try {
			let srvRecord = null;

			if (typeof options === 'undefined' || typeof options.enableSRV === 'undefined' || options.enableSRV) {
				srvRecord = await resolveSRV(host);

				if (srvRecord) {
					host = srvRecord.host;
					port = srvRecord.port;
				}
			}

			await socket.connect({ host, port, timeout: options?.timeout ?? 1000 * 5 });

			// Ping packet
			// https://wiki.vg/Server_List_Ping#Beta_1.8_to_1.3
			{
				socket.writeByte(0xFE);
				await socket.flush(false);
			}

			// Response packet
			// https://wiki.vg/Server_List_Ping#Beta_1.8_to_1.3
			{
				const packetID = await socket.readByte();
				if (packetID !== 0xFF) throw new Error('Expected server to send 0xFF kick packet, got ' + packetID);

				const packetLength = await socket.readInt16BE();
				const remainingData = await socket.readBytes(packetLength * 2);

				const [motd, onlinePlayersString, maxPlayersString] = remainingData.swap16().toString('utf16le').split('\u00A7');

				socket.close();

				clearTimeout(timeout);

				resolve({
					players: {
						online: parseInt(onlinePlayersString),
						max: parseInt(maxPlayersString)
					},
					motd,
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