const formattingCode = /§[a-fklmnor0-9]/g;

class Description {
	public descriptionText: string;

	constructor(descriptionText: string) {
		this.descriptionText = descriptionText;
	}

	toString(): string {
		return this.descriptionText;
	}

	toRaw(): string {
		return this.descriptionText.replace(formattingCode, '');
	}

	// TODO: implement coercing to HTML string
}

export default Description;