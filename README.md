# Rosetta

Rosetta is a highly experimental project that intends to transpile various languages into eachother. 
Currently this is only somewhat able to transpile javascript to kotlin, although the type inference and the javascript standard library are not supported in the slightest.
See [these notes](./NOTES.md) for how this project will eventually work.

This eventually will be stable but currently is not in the slightest, and is very hacky.

If you are looking for a current solution for this problem it might be valueable to look into [jsii](https://github.com/aws/jsii) (which happens to have a subpackage called rosetta funnily enough, which sort of does the same thing but has some limitations and has different meanings for some synatax. 
