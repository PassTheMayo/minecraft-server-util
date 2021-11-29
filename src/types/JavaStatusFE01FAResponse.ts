import { SRVRecord } from './SRVRecord';

export interface JavaStatusFE01FAResponse {
	protocolVersion: number,
	version: string,
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