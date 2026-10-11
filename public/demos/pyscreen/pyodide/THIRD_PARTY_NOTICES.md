# Third-party notices

## Pyodide Core 0.27.8

The bundled `pyodide.mjs`, `pyodide.asm.js`, `pyodide.asm.wasm`, `python_stdlib.zip`, and `pyodide-lock.json` are from the official Pyodide Core 0.27.8 release. This runtime embeds CPython 3.12.7. Pyodide is distributed under the Mozilla Public License 2.0 (MPL-2.0); the license text is in `MPL-2.0.txt`.

- Source repository and matching release: <https://github.com/pyodide/pyodide/tree/0.27.8>
- Release archive: <https://github.com/pyodide/pyodide/releases/tag/0.27.8>
- License: <https://mozilla.org/MPL/2.0/>
- Local changes to Pyodide files: none. This project adds a separate worker adapter and does not modify the bundled upstream files.

## CPython standard library

`python_stdlib.zip` contains the CPython 3.12.7 standard library distributed under the Python Software Foundation License Version 2. The license text is in `Python-PSF-2.0.txt`; the matching CPython source is available at <https://github.com/python/cpython/tree/v3.12.7>.

The Pyodide project ports CPython and its standard library to WebAssembly. This package does not modify those upstream files.
