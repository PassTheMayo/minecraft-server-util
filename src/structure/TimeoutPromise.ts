type PromiseCallbackResolve<T> = (value: T | PromiseLike<T>) => void;
type PromiseCallbackReject = (reason?: string) => void;
type PromiseCallback<T> = (resolve: PromiseCallbackResolve<T>, reject: PromiseCallbackReject) => void;

/**
 * This timeout promise is meant to automatically resolve/reject after the specified timeout, with the ability to cancel it prematurely
 * @class
 */
class TimeoutPromise<T> {
	/**
	 * The promise that will be executed on
	 * @type {Promise<T>}
	 */
	public promise: Promise<T>;
	private timer: NodeJS.Timeout;

	/**
	 * Creates a new timeout promise
	 * @param {number} timeout The timeout in milliseconds
	 * @param {string} reason The reason for the rejection when it times out
	 */
	constructor(timeout: number, callback: PromiseCallback<T>) {
		let resolve: PromiseCallbackResolve<T> = () => undefined;
		let reject: PromiseCallbackReject = () => undefined;

		this.promise = new Promise<T>((res, rej) => {
			resolve = res;
			reject = rej;
		});

		this.timer = setTimeout(() => {
			callback(resolve, reject);
		}, timeout);
	}

	/**
	 * Cancels the promise from rejecting after the specified time
	 * @returns {void}
	 */
	cancel(): void {
		clearTimeout(this.timer);
	}
}

export default TimeoutPromise;