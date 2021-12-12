import dns from 'dns';
import { SRVRecord } from '../types/SRVRecord';

export function resolveSRV(host: string, protocol = 'tcp'): Promise<SRVRecord | null> {
	return new Promise((resolve) => {
		dns.resolveSrv(`_minecraft._${protocol}.${host}`, (error, addresses) => {
			if (error || addresses.length < 1) return resolve(null);

			const address = addresses[0];

			resolve({ host: address.name, port: address.port });
		});
	});
}