import { SourceLocation, Node } from "../unit/Node";

export abstract class Expression extends Node {
	public abstract readonly type: string;

	constructor(source: SourceLocation) {
		super(source);
	}
}
