# Repository Guidelines

## Project Structure & Module Organization
- Root: Node.js tooling (`package.json`, `node_modules`) used by tests.
- Circuits grouped by topic:
  - `boolean_constraints/<circuit_name>/`
  - `boolean_templates/<circuit_name>_template/`
  - `quadratic_constraints/<circuit_name>/`
- Each circuit folder contains a `.circom` file, a Mocha test (`*.test.js`), and local `package.json` with `compile`/`test` scripts. Build artifacts are written to `*_js/` (WASM, R1CS, sym, witness calculator).

## Build, Test, and Development Commands
- Install dependencies (root): `npm ci`
- Compile a circuit: `cd boolean_constraints/bitwise_and && npm run compile`
- Run a circuit’s tests: `npm test`
- Run all boolean constraint tests:
  - Bash: `bash boolean_constraints/test_all.sh`
  - Node helper: `node boolean_constraints/test_runner.js`
- Notes: Requires Circom 2.x in PATH (`circom --version`). Tests call `circom` directly.

## Coding Style & Naming Conventions
- Circom: use Circom 2.0 syntax; two-space indent; lowercase_with_underscores for component, signal, and file names (e.g., `bitwise_and.circom`). Keep small, composable components.
- JavaScript tests: Node + Mocha + Chai. Prefer `const`/`let`, semicolons, and descriptive `describe/it` blocks.
- Artifacts: never hand-edit files in `*_js/`; they are generated.

## Testing Guidelines
- Frameworks: Mocha + Chai; tests live next to circuits as `*.test.js`.
- Conventions: one `describe("<Circuit>")` per circuit; test happy paths and failure cases; compile in `before()`.
- Run: from the circuit directory, `npm test`. Keep all existing tests green.

## Commit & Pull Request Guidelines
- Commits: imperative mood and scoped prefix, e.g., `boolean: add bitwise_and` or `quad: fix square_root edge case`.
- PRs: include summary, rationale, affected paths, and screenshots/logs when helpful. Link related issues. Ensure `npm test` passes for changed circuits.

## Security & Tooling Notes
- Prereqs: Node 18+, Circom 2.x. `snarkjs` is used via tests where relevant.
- Do not commit secrets or large build outputs; `*_js/` may be regenerated locally.
