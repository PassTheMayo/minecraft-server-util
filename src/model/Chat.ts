type ColorNames =
	| 'black'
	| 'dark_blue'
	| 'dark_green'
	| 'dark_aqua'
	| 'dark_red'
	| 'dark_purple'
	| 'gold'
	| 'gray'
	| 'dark_gray'
	| 'blue'
	| 'green'
	| 'aqua'
	| 'red'
	| 'light_purple'
	| 'yellow'
	| 'white'
	| 'minecoin_gold';

type ColorCodes = '0'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g';

type FormatCode =
	| 'obfuscated'
	| 'bold'
	| 'strikethrough'
	| 'underline'
	| 'italic'
	| 'reset';

interface Chat {
	text: string,
	bold?: string,
	italic?: string,
	underlined?: string,
	strikethrough?: string,
	obfuscated?: string,
	color?: ColorNames | ColorCodes,
	extra?: Chat[]
}

export { Chat, ColorCodes, ColorNames, FormatCode };