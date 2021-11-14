import assert from 'assert';
import crypto from 'crypto';
import net from 'net';
import { TextDecoder } from 'util';
import { SendVoteOptions } from './model/Options';

const decoder = new TextDecoder('utf8');

interface VotifierPayload {
	serviceName: string,
	username: string,
	address: string,
	timestamp: number,
	challenge: string,
	uuid?: string
}

interface VotifierMessage {
	payload: string,
	signature: string
}

/**
 * Sends a Votifier v2 vote to the specified server
 * @param {SendVoteOptions} [options] The options to use when sending the vote
 * @returns {Promise<ScanLANResponse>} The response of the scan
 * @async
 */
export default async function sendVote(options: SendVoteOptions): Promise<void> {
	// Assert that the arguments are the correct type and format
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an object or undefined, got ${typeof options}`);
	assert(typeof options === 'object', `Expected 'options' to be an object, got ${typeof options}`);
	assert(typeof options.host === 'string', `Expected 'options.host' to be a string, got ${typeof options.host}`);
	assert(options.host.length > 0, 'Expected \'options.host\' to have content, got an empty string');
	assert(typeof options.port === 'number', `Expected 'options.port' to be a number, got ${typeof options.port}`);
	assert(options.port > 0, `Expected 'options.port' to be greater than 0, got ${options.port}`);
	assert(options.port < 65536, `Expected 'options.port' to be less than 65536, got ${options.port}`);
	assert(Number.isInteger(options.port), `Expected 'options.port' to be an integer, got ${options.port}`);
	assert(typeof options.serviceName === 'string', `Expected 'options.serviceName' to be a string, got ${typeof options.serviceName}`);
	assert(options.serviceName.length > 0, 'Expected \'options.serviceName\' to have content, got an empty string');
	assert(typeof options.username === 'string', `Expected 'options.username' to be a string, got ${typeof options.username}`);
	assert(options.username.length > 2, `Expected 'options.username' to have a length greater than or equal to 3, got ${options.username.length}`);
	assert(options.username.length < 33, `Expected 'options.username' to have a length less than or equal to 32, got ${options.username.length}`);
	assert(/^[A-Za-z0-9_]+$/.test(options.username), `Expected 'options.username' to match allowed Minecraft username characters, got '${options.username}'`);
	assert(typeof options.timestamp === 'number' || typeof options.timestamp === 'undefined', `Expected 'options.timestamp' to be a number or undefined, got ${typeof options.timestamp}`);

	if (typeof options.timestamp !== 'undefined') {
		assert(options.timestamp > 0, `Expected 'options.timestamp' to be greater than or equal to 1, got ${options.timestamp}`);
	}

	assert(typeof options.uuid === 'undefined' || typeof options.uuid === 'string', `Expected 'options.uuid' to be either 'undefined' or a 'string', got '${typeof options.uuid}'`);
	assert(typeof options.timeout === 'number' || typeof options.timestamp === 'undefined', `Expected 'options.timeout' to be a number or undefined, got ${typeof options.timeout}`);

	if (typeof options.timeout !== 'undefined') {
		assert(options.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${options.timeout}`);
	}

	assert(typeof options.token === 'string', `Expected 'options.token' to be a string, got ${typeof options.token}`);
	assert(options.token.length > 0, 'Expected \'options.token\' to have content, got an empty string');

	return new Promise((resolve, reject) => {
		const conn = net.createConnection({ host: options.host, port: options.port ?? 8192, timeout: options.timeout ?? 1000 * 15 });
		conn.setTimeout(options.timeout ?? 1000 * 15);

		let state = 0;

		conn.on('data', (data) => {
			switch (state) {
				case 0: {
					const handshakeData = decoder.decode(data);

					if (!handshakeData.startsWith('VOTIFIER')) {
						conn.end();

						return reject('Server sent an invalid handshake');
					}

					const split = handshakeData.split(' ');

					if (parseInt(split[1]) !== 2) {
						conn.end();

						return reject('Unsupported server Votifier version');
					}

					state = 1;

					const payload: VotifierPayload = {
						serviceName: options.serviceName,
						username: options.username,
						address: options.host,
						timestamp: options.timestamp ?? Date.now(),
						challenge: split[2].substring(0, split[2].length - 1)
					};

					if (options.uuid && options.uuid.length > 0) {
						payload.uuid = options.uuid;
					}

					const payloadSerialized = JSON.stringify(payload);

					const message: VotifierMessage = {
						payload: payloadSerialized,
						signature: ''
					};

					message.signature = crypto.createHmac('sha256', options.token).update(payloadSerialized).digest('base64');

					const messageSerialized = JSON.stringify(message);

					const buffer = Buffer.alloc(messageSerialized.length + 4);
					buffer.writeUInt16BE(0x733a, 0);
					buffer.writeUInt16BE(messageSerialized.length, 2);
					buffer.write(messageSerialized, 4);
					conn.write(buffer);

					break;
				}
				case 1: {
					conn.end();

					try {
						const result = JSON.parse(decoder.decode(data));

						if (result.status === 'ok') {
							resolve();
						} else {
							reject(new Error(`Server returned an error: ${result.error}`));
						}
					} catch (e) {
						reject(e);
					}
				}
			}
		});

		conn.on('error', (error) => {
			conn.end();

			reject(error);
		});

		conn.on('close', () => {
			conn.end();

			reject('Socket prematurely closed');
		});

		conn.on('end', () => {
			conn.end();

			reject('Socket prematurely closed');
		});

		conn.on('timeout', () => {
			conn.end();

			reject('Connection to server timed out');
		});
	});
}