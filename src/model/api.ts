/**
 * Server Information Response.
 */
export interface Response {
    host: string
    port: number
    srvRecord?: {
        host: string
        port: number
    }
    version?: string
    protocolVersion?: number
    onlinePlayers?: number
    maxPlayers?: number
    samplePlayers?: SamplePlayer[]
    descriptionText?: string
    favicon?: string
    modList?: {
        modid: string
        version: string
    }[]
}

/**
 * Ping Options
 */
export interface PingOptions {
    port?: number
    protocolVersion?: number
    pingTimeout?: number
    enableSRV?: boolean
}

export interface SamplePlayer {
    name: string
    id: string
}

export type ErrorType = Error | null;
export type PingCallback = (error: ErrorType, response: Response | null) => void;