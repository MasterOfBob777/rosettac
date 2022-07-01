declare module "node-stringbuilder" {
	export class StringBuilder {
		constructor();
		append(...args: any[]);
		toString(): string;
	}

	export default StringBuilder;
}

interface Options {
	/**
	 * Which ASTTranspiler backend to use.
	 */
	backend: string;

	/**
	 * Paths to the source files to transpile. 
	 */
	files: string[];

	/**
	 * Whether to combine all files into a single javascript file.
	 * This might still result in multiple output files.
	 */
	bundle: boolean;

	/**
	 * The output directory.
	 */
	outDir: string;

	/**
	 * 
	 */
	outBase: string;

	general: {
		/**
		 * The default number type to use.
		 * Although that the default is highly inefficient, it is mainly 
		 * chosen for maximum compatibility with Javascript.
		 * @default "double"
		 */
		numberType: string;

		/**
		 * Prevents any unreachable code from being removed.
		 */
		noDeadCodeElimination: boolean;

		/**
		 * A map of module names to paths that will be treated as a replacement.
		 */
		moduleOverrides: Record<string, string>;
	}

	experimental: {
		/**
		 * Attempts to avoid all js wrapper types and use the selected backends standard library.
		 * This might not be possible for all source files. 
		 */
		noWrapperTypes: boolean;
	}
}