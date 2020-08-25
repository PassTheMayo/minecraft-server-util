import { resolveSrv } from 'dns';

export interface SrvResponse {
    host: string
    port: number
}

export function resolveSRV(host: string): Promise<SrvResponse | undefined> {
    return new Promise((resolve) => {
        resolveSrv('_minecraft._tcp.' + host, (error, addresses) => {
            if (error || !addresses || addresses.length < 1) return resolve(undefined);

            resolve({ host: addresses[0].name, port: addresses[0].port });
        });
    });
}