import { ModInfo } from './RawStatusResponse';
import Description from '../structure/Description';

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
	description: Description | null,
	favicon: string | null,
	modInfo: ModInfo | null
}

interface BedrockStatusResponse {
	host: string,
	port: number,
	edition: string | null,
	serverGUID: bigint,
	motdLine1: Description | null,
	motdLine2: Description | null,
	version: string | null,
	protocolVersion: number | null,
	maxPlayers: number | null,
	onlinePlayers: number | null,
	serverID: string | null,
	gameMode: string | null,
	gameModeID: number | null,
	portIPv4: number | null,
	portIPv6: number | null
}

export { StatusResponse, BedrockStatusResponse, SamplePlayer };