import assert from 'assert';
import crypto from 'crypto';
import TCPClient from './structure/TCPClient';
import { SendLegacyVoteOptions } from './types/SendLegacyVoteOptions';

const wordwrap = (str: string, size: number): string => str.replace(
	new RegExp(`(?![^\\n]{1,${size}}$)([^\\n]{1,${size}})\\s`, 'g'), '$1\n'
);

export function sendLegacyVote(host: string, port = 8192, options: SendLegacyVoteOptions): Promise<void> {
	host = host.trim();

	options.key = options.key.replace(/ /g, '+');
	options.key = wordwrap(options.key, 65);

	assert(typeof host === 'string', `Expected 'host' to be a 'string', got '${typeof host}'`);
	assert(host.length > 1, `Expected 'host' to have a length greater than 0, got ${host.length}`);
	assert(typeof port === 'number', `Expected 'port' to be a 'number', got '${typeof port}'`);
	assert(Number.isInteger(port), `Expected 'port' to be an integer, got '${port}'`);
	assert(port >= 0, `Expected 'port' to be greater than or equal to 0, got '${port}'`);
	assert(port <= 65535, `Expected 'port' to be less than or equal to 65535, got '${port}'`);
	assert(typeof options === 'object', `Expected 'options' to be an 'object', got '${typeof options}'`);
	assert(typeof options.username === 'string', `Expected 'options.username' to be an 'string', got '${typeof options.username}'`);
	assert(options.username.length > 1, `Expected 'options.username' to have a length greater than 0, got ${options.username.length}`);
	assert(typeof options.key === 'string', `Expected 'options.key' to be an 'string', got '${typeof options.key}'`);
	assert(options.key.length > 1, `Expected 'options.key' to have a length greater than 0, got ${options.key.length}`);

	return new Promise(async (resolve, reject) => {
		let socket: TCPClient | undefined = undefined;

		const timeout = setTimeout(() => {
			socket?.close();

			reject(new Error('Timed out while retrieving server status'));
		}, options?.timeout ?? 1000 * 5);

		try {
			socket = new TCPClient();

			await socket.connect({ host, port, timeout: options?.timeout ?? 1000 * 5 });

			// Handshake packet
			// https://github.com/NuVotifier/NuVotifier/wiki/Technical-QA#handshake
			{
				const version = await socket.readStringUntil(0x0A);
				const split = version.split(' ');

				if (split[0] !== 'VOTIFIER') throw new Error('Not connected to a Votifier server. Expected VOTIFIER in handshake, received: ' + version);
			}

			// Send vote packet
			// https://github.com/NuVotifier/NuVotifier/wiki/Technical-QA#protocol-v1
			{
				const timestamp = options.timestamp ?? Date.now();
				const address = options.address ?? host + ':' + port;

				const publicKey = `-----BEGIN PUBLIC KEY-----\n${options.key}\n-----END PUBLIC KEY-----\n`;
				const vote = `VOTE\n${options.serviceName}\n${options.username}\n${address}\n${timestamp}\n`;

				const encryptedPayload = crypto.publicEncrypt(
					{
						key: publicKey,
						padding: crypto.constants.RSA_PKCS1_PADDING,
					},
					Buffer.from(vote)
				);

				socket.writeBytes(encryptedPayload);
				await socket.flush(false);
			}

			// Close connection and resolve
			{
				clearTimeout(timeout);

				socket.close();

				resolve();
			}
		} catch (e) {
			clearTimeout(timeout);

			socket?.close();

			reject(e);
		}
	});
}
