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

// BedrockStatusOptions is an alias because it has no additional properties
export { StatusOptions, BedrockStatusOptions, QueryOptions, RCONOptions, BaseOptions };