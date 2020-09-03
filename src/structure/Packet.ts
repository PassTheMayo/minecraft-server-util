class Packet {
	public data: number[] = [];

	readByte(): number {
		if (this.data.length < 1) {
			throw new Error('Cannot readByte() as buffer is empty');
		}

		return this.data.shift() || 0;
	}

	readBytes(length: number): number[] {
		if (this.data.length < 1) {
			throw new Error('Cannot readByte() as buffer is empty');
		}

		return this.data.splice(0, length);
	}

	writeByte(...values: number[]): void {
		this.data.push(...values);
	}

	readShort(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShort() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readInt16BE();
	}

	writeShort(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeInt16BE(value);
		this.writeByte(...buf);
	}

	readShortLE(): number {
		if (this.data.length < 2) {
			throw new Error('Cannot readShortLE() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(2));

		return buf.readInt16LE();
	}

	writeShortLE(value: number): void {
		const buf = Buffer.alloc(2);
		buf.writeInt16LE(value);
		this.writeByte(...buf);
	}

	readInt(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readInt32BE();
	}

	writeInt(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeInt32BE(value);
		this.writeByte(...buf);
	}

	readIntLE(): number {
		if (this.data.length < 4) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(4));

		return buf.readInt32LE();
	}

	writeIntLE(value: number): void {
		const buf = Buffer.alloc(4);
		buf.writeInt32LE(value);
		this.writeByte(...buf);
	}

	readLong(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigInt64BE();
	}

	writeLong(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigInt64BE(value);
		this.writeByte(...buf);
	}

	readLongLE(): bigint {
		if (this.data.length < 8) {
			throw new Error('Cannot readInt() as buffer is empty or too small for type');
		}

		const buf = Buffer.from(this.readBytes(8));

		return buf.readBigInt64LE();
	}

	writeLongLE(value: bigint): void {
		const buf = Buffer.alloc(8);
		buf.writeBigInt64LE(value);
		this.writeByte(...buf);
	}

	readVarInt(): number {
		let numRead = 0;
		let result = 0;
		let read: number, value: number;

		do {
			if (numRead > 4) { throw new Error('VarInt exceeds data bounds'); }

			read = this.readByte();
			value = (read & 0b01111111);
			result |= (value << (7 * numRead));

			numRead++;

			if (numRead > 5) {
				throw new Error('VarInt is too big');
			}
		} while ((read & 0b10000000) != 0);

		return result;
	}

	writeVarInt(value: number): void {
		do {
			let temp = value & 0b01111111;

			value >>>= 7;

			if (value != 0) {
				temp |= 0b10000000;
			}

			this.writeByte(temp);
		} while (value != 0);
	}

	readString(): string {
		const length = this.readVarInt();

		return String.fromCodePoint(...this.data.splice(0, length));
	}

	writeString(value: string, writeLength: boolean): void {
		if (writeLength) {
			this.writeVarInt(value.length);
		}

		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}
	}

	readStringNT(): string {
		let read, result = '';

		while ((read = this.readByte()) !== 0) {
			result += String.fromCodePoint(read);
		}

		return result;
	}

	writeStringNT(value: string): void {
		for (let i = 0; i < value.length; i++) {
			this.writeByte(value.codePointAt(i) || 0);
		}

		this.writeByte(0);
	}
}

export default Packet;