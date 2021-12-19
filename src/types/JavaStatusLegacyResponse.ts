import { SRVRecord } from './SRVRecord';

export interface JavaStatusLegacyResponse {
    version: {
        name: string | null,
        protocol: number | null
    } | null,
    players: {
        online: number,
        max: number
    },
    motd: {
        raw: string,
        clean: string,
        html: string
    },
    srvRecord: SRVRecord | null
}