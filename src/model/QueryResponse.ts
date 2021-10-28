import { MOTD } from './MOTD';
import { SRVRecord } from '../util/resolveSRV';

interface BasicQueryResponse {
    host: string,
    port: number,
    srvRecord: SRVRecord | null,
    gameType: string,
    levelName: string,
    onlinePlayers: number,
    maxPlayers: number,
    motd: MOTD,
    roundTripLatency: number
}

interface FullQueryResponse {
    host: string,
    port: number,
    srvRecord: SRVRecord | null,
    gameType: string | null,
    version: string | null,
    software: string | null,
    plugins: string[],
    levelName: string | null,
    onlinePlayers: number | null,
    maxPlayers: number | null,
    players: string[],
    motd: MOTD,
    roundTripLatency: number
}

export { BasicQueryResponse, FullQueryResponse };