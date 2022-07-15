import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * label:
 * ```
 */
export class LabelStatement extends Statement {
	type: "LabelStatement" = "LabelStatement";

	constructor(public readonly label: string, source: SourceLocation) {
		super(source);
	}
}
