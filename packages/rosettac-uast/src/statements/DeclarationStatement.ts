import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * // declaration
 * ```
 */
export class DeclarationStatement extends Statement {
	type: "DeclarationStatement" = "DeclarationStatement";

	constructor(
		public readonly declaration: Declaration,
		source: SourceLocation,
	) {
		super(source);
	}
}
