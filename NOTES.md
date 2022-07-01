# Intro 
This project intends to compile javascript code to kotlin. This, of course, is somewhat impossible due to javascript being a dynamicly typed language and kotlin being a statically typed one. Regardless, this project attempts to ascertain as much type information as possible through methods such as typescript type annotations or jsdoc type annotations. This compiler attempts to be as lenient as possible (to widen the range of projects this would be compatible with), but will error on a good majority of projects for various reasons.

# Components

### Javascript Parser

### Type Inferer

### AST Transpiler

# Process

This compiler operates in essentially this order: 
- Get Javascript source text
- Convert the source text into a compatible AST
- Modify and analyze the AST to:
	- convert cjs modules to esm 
	- prevent unsupported patterns
		- dynamic import 
		- with statements
		- TODO : list others 
	- remove reduntant nodes
		- bottom level literals (i.e. "use strict" directives, or other pointless code)
		- general dce, when applicable 
	- add type information
		- ...from jsdoc comments
		- ...from external .d.ts files
		- ...from inline type annotations
		- when possible create type information for non megamorphic anonymous objects
		- infer simple types from literals
		- infer types from other typed values
- Convert the AST with type information to compatible kotlin source text
- If the option is enabled, repeat this process for all referenced files