import { MOTD } from './MOTD';

interface ScanLANServer {
    host: string;
    port: number;
    motd: MOTD;
}

interface ScanLANResponse {
    servers: ScanLANServer[];
}

export { ScanLANResponse, ScanLANServer };