import { SRVRecord } from './SRVRecord';

export interface JavaStatusFEResponse {
	players: {
		online: number,
		max: number
	},
	motd: string,
	srvRecord: SRVRecord | null
}