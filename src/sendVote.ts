import assert from 'assert';
import crypto from 'crypto';
import { TextEncoder } from 'util';
import TCPClient from './structure/TCPClient';

export interface SendVoteOptions {
	token: string,
	username: string,
	serviceName?: string,
	uuid?: string,
	timestamp?: number,
	timeout?: number
}

const encoder = new TextEncoder();

export async function sendVote(host: string, port = 8192, options: SendVoteOptions): Promise<void> {
	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object', `Expected 'options' to be an 'object', got '${typeof options}'`);
	assert(typeof options.username === 'string', `Expected 'options.username' to be an 'string', got '${typeof options.username}'`);
	assert(options.username.length > 1, `Expected 'options.username' to have a length greater than 0, got ${options.username.length}`);
	assert(typeof options.token === 'string', `Expected 'options.token' to be an 'string', got '${typeof options.token}'`);
	assert(options.token.length > 1, `Expected 'options.token' to have a length greater than 0, got ${options.token.length}`);

	const socket = new TCPClient();

	await socket.connect({ host, port, timeout: options?.timeout ?? 1000 * 5 });

	try {
		let challengeToken;

		// Handshake packet
		// https://github.com/NuVotifier/NuVotifier/wiki/Technical-QA#handshake
		{
			const version = await socket.readStringUntil(0x0A);
			const split = version.split(' ');

			if (split[1] !== '2') throw new Error('Unsupported Votifier version: ' + split[1]);

			challengeToken = split[2];
		}

		// Send vote packet
		// https://github.com/NuVotifier/NuVotifier/wiki/Technical-QA#protocol-v2
		{
			const payload: Record<string, string | number> = {
				serviceName: options.serviceName ?? 'minecraft-server-util (https://github.com/PassTheMayo/minecraft-server-util)',
				username: options.username,
				address: host + ':' + port,
				timestamp: options.timestamp ?? Date.now(),
				challenge: challengeToken
			};

			if (options.uuid) {
				payload.uuid = options.uuid;
			}

			const payloadSerialized = JSON.stringify(payload);

			const message = {
				payload: payloadSerialized,
				signature: crypto.createHmac('sha256', options.token).update(payloadSerialized).digest('base64')
			};

			const messageSerialized = JSON.stringify(message);
			const messageBytes = encoder.encode(messageSerialized);

			socket.writeInt16BE(0x733A);
			socket.writeInt16BE(messageBytes.byteLength);
			socket.writeBytes(messageBytes);
			await socket.flush(false);
		}

		// Response packet
		// https://github.com/NuVotifier/NuVotifier/wiki/Technical-QA#protocol-v2
		{
			const responseString = await socket.readStringUntil(0x0A);
			const response = JSON.parse(responseString);

			switch (response.status) {
				case 'ok': {
					return;
				}
				case 'error': {
					throw new Error(response.cause + ': ' + response.error);
				}
				default: {
					throw new Error('Server sent an unknown response: ' + responseString);
				}
			}
		}
	} finally {
		await socket.close();
	}
}