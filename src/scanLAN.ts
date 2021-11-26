import assert from 'assert';
import dgram from 'dgram';
import { TextDecoder } from 'util';

export interface ScanLANOptions {
	scanTime: number
}

export interface ScannedServer {
	host: string,
	port: number,
	motd: string
}

const decoder = new TextDecoder('utf8');
const pattern = /\[MOTD\](.*)\[\/MOTD\]\[AD\](\d{1,5})\[\/AD\]/;

export async function scanLAN(options: Partial<ScanLANOptions> = {}): Promise<ScannedServer[]> {
	assert(typeof options === 'object', `Expected 'options' to be an 'object', got '${typeof options}'`);

	const servers: ScannedServer[] = [];

	const socket = dgram.createSocket('udp4');

	socket.on('message', (message, info) => {
		const match = decoder.decode(message).match(pattern);
		if (!match || match.length < 3) return;

		let port = parseInt(match[2]);
		if (isNaN(port)) port = 25565;

		if (servers.some((server) => server.host === info.address && server.port === port)) return;

		servers.push({
			host: info.address,
			port,
			motd: match[1]
		});
	});

	socket.bind(4445, () => {
		socket.addMembership('224.0.2.60');
	});

	return new Promise((resolve, reject) => {
		const timeout = setTimeout(async () => {
			await new Promise<void>((resolve) => socket.close(() => resolve()));

			resolve(servers);
		}, options?.scanTime ?? 1000 * 5);

		socket.on('error', (error: Error) => {
			socket.close();

			clearTimeout(timeout);

			reject(error);
		});
	});
}