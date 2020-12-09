import { status } from './status';
import { statusFE01FA } from './statusFE01FA';
import { statusFE01 } from './statusFE01';
import { statusFE } from './statusFE';
import { statusBedrock } from './statusBedrock';
import { query } from './query';
import { queryFull } from './queryFull';
import scanLAN from './scanLAN';
import Description from './structure/Description';
import Packet from './structure/Packet';
import { RCON } from './structure/RCON';
import TCPSocket from './structure/TCPSocket';
import UDPSocket from './structure/UDPSocket';
import TimeoutPromise from './structure/TimeoutPromise';
import { StatusOptions } from './model/Options';
import { StatusResponse } from './model/StatusResponse';

/**
 * Retrieves the status of the server by using the 1.7+ format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 * @deprecated Use `{@see #status}` instead
 */
function ping(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `ping()` method has been deprecated in favor of a more appropriate name `status()`. `ping()` will be removed in the next major release.', 'DeprecationWarning');

	return status(host, options);
}

/**
 * Retrieves the status of the server by using the 1.6.1 - 1.6.4 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 * @deprecated Use `statusFE01FA()` instead
 */
function pingFE01FA(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `pingFE01FA()` method has been deprecated in favor of a more appropriate name `statusFE01FA()`. `pingFE01FA()` will be removed in the next major release.', 'DeprecationWarning');

	return statusFE01FA(host, options);
}

/**
 * Retrieves the status of the server by using the 1.4.2 - 1.5.2 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 * @deprecated Use `statusFE01()` instead
 */
function pingFE01(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `pingFE01()` method has been deprecated in favor of a more appropriate name `statusFE01()`. `pingFE01()` will be removed in the next major release.', 'DeprecationWarning');

	return statusFE01(host, options);
}

/**
 * Retrieves the status of the server by using the Beta 1.8 - 1.3.2 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 * @deprecated Use `statusFE()` instead
 */
function pingFE(host: string, options?: StatusOptions): Promise<StatusResponse> {
	process.emitWarning('The `pingFE()` method has been deprecated in favor of a more appropriate name `statusFE()`. `pingFE()` will be removed in the next major release.', 'DeprecationWarning');

	return statusFE(host, options);
}

export = { ping, pingFE01FA, pingFE01, pingFE, status, statusFE01FA, statusFE01, statusFE, statusBedrock, query, queryFull, scanLAN, Description, Packet, RCON, TCPSocket, UDPSocket, TimeoutPromise };