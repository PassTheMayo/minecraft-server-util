function getTimeoutPromise<T>(timeout: number, rejectMessage: string): Promise<T> {
	return new Promise((resolve, reject) => {
		setTimeout(() => reject(rejectMessage), timeout);
	});
}

export default getTimeoutPromise;