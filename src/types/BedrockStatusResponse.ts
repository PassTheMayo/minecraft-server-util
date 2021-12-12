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
	portIPv4: number | null,
	portIPv6: number | null,
	srvRecord: SRVRecord | null
}