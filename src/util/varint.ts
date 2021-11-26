export async function readVarInt(readByte: () => Promise<number>): Promise<number> {
	let numRead = 0;
	let result = 0;
	let read: number, value: number;

	do {
		if (numRead > 4) throw new Error('VarInt exceeds data bounds');

		read = await readByte();
		value = (read & 0b01111111);
		result |= (value << (7 * numRead));

		numRead++;

		if (numRead > 5) throw new Error('VarInt is too big');
	} while ((read & 0b10000000) != 0);

	return result;
}

export function writeVarInt(value: number): Buffer {
	let buf = Buffer.alloc(0);

	do {
		let temp = value & 0b01111111;

		value >>>= 7;

		if (value != 0) {
			temp |= 0b10000000;
		}

		buf = Buffer.concat([buf, Buffer.from([temp])]);
	} while (value != 0);

	return buf;
}