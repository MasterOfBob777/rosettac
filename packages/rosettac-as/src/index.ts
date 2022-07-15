import { Compiler as FromCompiler } from "./from/from"
import { Compiler as ToCompiler } from "./to/to"

export default {
	name: "rosettac-as",
	version: "0.0.1",
	from: FromCompiler,
	to: ToCompiler,
}
