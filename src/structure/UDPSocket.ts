import dgram from 'dgram';
import Packet from './Packet';

class UDPSocket {
	private host: string;
	private port: number;
	private socket: dgram.Socket;
	private buffer: {
		info: dgram.RemoteInfo,
		message: Buffer
	}[];

	constructor(host: string, port: number) {
		this.host = host;
		this.port = port;
		this.socket = dgram.createSocket('udp4');
		this.buffer = [];

		this.socket.on('message', (message, info) => {
			this.buffer.push({ info, message });
		});
	}

	// Reads a packet from the stream
	readPacket(): Promise<Packet> {
		if (this.buffer.length > 0) {
			const packet = new Packet();
			packet.data = [...(this.buffer.shift()?.message ?? [])];

			return Promise.resolve(packet);
		}

		return new Promise((resolve) => {
			let read = false;

			const messageHandler = () => {
				if (read) { return; }

				process.nextTick(() => {
					if (this.buffer.length > 0) {
						read = true;

						this.socket.removeListener('message', messageHandler);

						const packet = new Packet();
						packet.data = [...(this.buffer.shift()?.message ?? [])];

						resolve(packet);
					}
				});
			};

			this.socket.on('message', messageHandler);
		});
	}

	// Writes a packet to the stream
	writePacket(packet: Packet): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.send(Buffer.from(packet.data), this.port, this.host, (error) => {
				if (error) {
					return reject(error);
				}

				resolve();
			});
		});
	}

	// Destroys all event listeners and closes the connection
	destroy(): Promise<void> {
		return new Promise((resolve) => {
			this.socket.removeAllListeners();
			this.socket.close(() => {
				resolve();
			});
		});
	}
}

export default UDPSocket;