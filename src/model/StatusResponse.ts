import { ModInfo, RawStatusResponse } from './RawStatusResponse';
import { MOTD } from './MOTD';
import Favicon from '../structure/Favicon';

interface SamplePlayer {
	name: string,
	id: string
}

interface StatusResponse {
	host: string,
	port: number,
	srvRecord: {
		host: string,
		port: number
	} | null,
	version: string | null,
	protocolVersion: number | null,
	onlinePlayers: number | null,
	maxPlayers: number | null,
	samplePlayers: SamplePlayer[] | null,
	motd: MOTD | null,
	favicon: Favicon | null,
	modInfo: ModInfo | null,
	rawResponse?: RawStatusResponse | null,
	roundTripLatency: number
}

interface BedrockStatusResponse {
	host: string,
	port: number,
	edition: string | null,
	serverGUID: bigint,
	motd: MOTD,
	version: string | null,
	protocolVersion: number | null,
	maxPlayers: number | null,
	onlinePlayers: number | null,
	serverID: string | null,
	gameMode: string | null,
	gameModeID: number | null,
	portIPv4: number | null,
	portIPv6: number | null,
	roundTripLatency: number
}

export { StatusResponse, BedrockStatusResponse, SamplePlayer };