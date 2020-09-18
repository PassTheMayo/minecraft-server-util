import { status } from './status';
import { statusFE01FA } from './statusFE01FA';
import { statusFE01 } from './statusFE01';
import { statusFE } from './statusFE';
import { query } from './query';
import { queryFull } from './queryFull';
import Description from './structure/Description';
import Packet from './structure/Packet';
import { RCON } from './structure/RCON';
import TCPSocket from './structure/TCPSocket';
import UDPSocket from './structure/UDPSocket';
import { StatusOptions } from './model/Options';
import { StatusResponse } from './model/StatusResponse';

// Add a backwards compatible method for users who are upgrading with a deprecation warning
function ping(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `ping()` method has been deprecated in favor of a more appropriate name `status()`. `ping()` will be removed in the next major release.', 'DeprecationWarning');

	return status(host, options);
}

// Add a backwards compatible method for users who are upgrading with a deprecation warning
function pingFE01FA(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `pingFE01FA()` method has been deprecated in favor of a more appropriate name `statusFE01FA()`. `pingFE01FA()` will be removed in the next major release.', 'DeprecationWarning');

	return statusFE01FA(host, options);
}

// Add a backwards compatible method for users who are upgrading with a deprecation warning
function pingFE01(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `pingFE01()` method has been deprecated in favor of a more appropriate name `statusFE01()`. `pingFE01()` will be removed in the next major release.', 'DeprecationWarning');

	return statusFE01(host, options);
}

// Add a backwards compatible method for users who are upgrading with a deprecation warning
function pingFE(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `pingFE()` method has been deprecated in favor of a more appropriate name `statusFE()`. `pingFE()` will be removed in the next major release.', 'DeprecationWarning');

	return statusFE(host, options);
}

export = { ping, pingFE01FA, pingFE01, pingFE, status, statusFE01FA, statusFE01, statusFE, query, queryFull, Description, Packet, RCON, TCPSocket, UDPSocket };