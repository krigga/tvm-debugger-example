# TVM debugger example

This is a blueprint project showcasing how to setup TVM debugger. In order to do that, you need to follow a few simple steps. The first 3 steps are already done in this repo, but if you want to set TVM debugger in your own projects, you need to do them all.

1) Use the beta versions of blueprint and sandbox that include the debugger, like so:
```json
"@ton/blueprint": "^0.23.0-debugger.0",
"@ton/sandbox": "^0.21.0-debugger.1",
```
(put this in your `package.json`)

2) In your test file, compile your contracts using the `doCompile` function with `debugInfo` parameter, registering the contracts' source maps, like so:
```typescript
code = registerCompiledContract(await doCompile('Counter', {
    debugInfo: true,
}));
```
(put this in your `.spec.ts` file instead of `code = await compile('Counter');`)

3) In your test file, enable debugging using either the `blockchain.debug` global property, or individually on each address `(await blockchain.getContract(contract.address)).setDebug(true)`.

4) Install the [TVM Debugger VS Code extension](https://marketplace.visualstudio.com/items?itemName=krigga.tvm-debugger) and launch the test as usual (`yarn jest`).

5) Once you get the prompt `Please connect using the extension.`, launch Command Palette in your VS Code (usually it is bound to `Ctrl + Shift + P`), and choose `Debug TON contract (TVM)`.

6) Enjoy your debugging session!
