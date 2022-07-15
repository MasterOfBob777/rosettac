export class SourceLocation {
	constructor(
		public readonly start: number,
		public readonly end: number
	) {}
}

export abstract class Node {
	constructor(public readonly source: SourceLocation) {}
}
