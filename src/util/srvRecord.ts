import dns from 'dns';
import { SRVRecord } from '../types/SRVRecord';

export function resolveTCPSRV(host: string): Promise<SRVRecord | null> {
	return new Promise((resolve) => {
		dns.resolveSrv(`_minecraft._tcp.${host}`, (error, addresses) => {
			if (error || addresses.length < 1) return resolve(null);

			const address = addresses[0];

			resolve({ host: address.name, port: address.port });
		});
	});
}

export function resolveUDPSRV(host: string): Promise<SRVRecord | null> {
	return new Promise((resolve) => {
		dns.resolveSrv(`_minecraft._udp.${host}`, (error, addresses) => {
			if (error || addresses.length < 1) return resolve(null);

			const address = addresses[0];

			resolve({ host: address.name, port: address.port });
		});
	});
}