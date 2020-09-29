/**
 * Creates a new promise that automatically rejects after the specified timeout period.
 * @param {number} timeout The timeout period in milliseconds
 * @param {string} rejectMessage The reject reason if it times out
 * @returns {Promise<T>} The promise that rejects after the specified timeout
 */
function getTimeoutPromise<T>(timeout: number, rejectMessage: string): Promise<T> {
	return new Promise((resolve, reject) => {
		setTimeout(() => reject(rejectMessage), timeout);
	});
}

export default getTimeoutPromise;