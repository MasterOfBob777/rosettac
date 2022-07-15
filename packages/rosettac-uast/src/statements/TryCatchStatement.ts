import { SourceLocation } from "../unit/Node";
import { Statement } from "./Statement";

/**
 *
 * @example
 * ```ts
 * try {
 *  // body
 * } catch (e: Error) {
 * 	// handler
 * }
 */
export class TryCatchStatement extends Statement {
	type: "TryCatchStatement" = "TryCatchStatement";

	constructor(
		public readonly body: Statement,
		public readonly catchParams: Pattern[],
		public readonly handler: Statement,
		source: SourceLocation,
	) {
		super(source);
	}
}
