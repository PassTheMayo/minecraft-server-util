import { SRVRecord } from './SRVRecord';

export interface BedrockStatusResponse {
	edition: string,
	motd: {
		raw: string,
		clean: string,
		html: string
	},
	version: {
		name: string,
		protocol: number
	},
	players: {
		online: number,
		max: number
	},
	serverGUID: bigint,
	serverID: string,
	gameMode: string,
	gameModeID: number,
	portIPv4: number,
	portIPv6: number,
	srvRecord: SRVRecord | null
}