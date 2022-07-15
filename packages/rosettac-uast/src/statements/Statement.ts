import { Node, SourceLocation } from '../unit/Node';

export abstract class Statement extends Node {
	public abstract readonly type: string;

	constructor(source: SourceLocation) {
		super(source);
	}
}
