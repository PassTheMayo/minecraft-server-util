interface BaseOptions {
    port?: number,
    enableSRV?: boolean,
    timeout?: number
}

interface StatusOptions extends BaseOptions {
    protocolVersion?: number
}

interface BedrockStatusOptions extends BaseOptions {
    clientGUID?: number
}

interface QueryOptions extends BaseOptions {
    sessionID?: number
}

interface RCONOptions extends BaseOptions {
    password?: string
}

interface ScanLANOptions {
    scanTime?: number
}

// BedrockStatusOptions is an alias because it has no additional properties
export { StatusOptions, BedrockStatusOptions, QueryOptions, RCONOptions, ScanLANOptions, BaseOptions };