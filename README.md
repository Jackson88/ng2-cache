# ng2-cache

>ng2-cache library compatible with AoT compilation &amp; Tree shaking like an official package.

This lib allows you to use ng2-cache library for **Angular v5** apps written in _TypeScript_, _ES6_ or _ES5_. 
The project is based on the official _Angular_ packages.

Get the [Changelog](./CHANGELOG.md).

## How to use

1. `npm install ng2-cache --save`
2. Import it in your main app module
    ```
    @NgModule({
    declarations: [
        ....
    ],
    imports: [
        ....
        Ng2CacheModule
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

3. Use it inside your `Component` by DI

    ````
    ...
    import { CacheService, CacheStoragesEnum } from 'ng2-cache';
    ...

    export class AppComponent {
    
    constructor(private _cacheService: CacheService) { 
        this._cacheService.set('key', ['some data']);
    } 
    ````
That's it. Now you don't have to mention it's reference in `tsfoncig.json`

## Contents
* [1 Project structure](#1)
* [2 Building](#2)
* [3 Publishing](#3)
* [4 Using the library](#4)
* [5 What it is important to know](#5)

## <a name="1"></a>1 Project structure
- Library:
    - **src** folder for the classes
    - **public_api.ts** entry point for all public APIs of the package
    - **package.json** _npm_ options
    - **rollup.config.js** _Rollup_ configuration for building the _umd_ bundles
    - **rollup.es.config.js** _Rollup_ configuration for building the _es2015_ bundles
    - **tsconfig-build.json** _ngc_ compiler options for _AoT compilation_
    - **build.js** building process using _ShellJS_
- Extra:
    - **tslint.json**  _Angular TSLint Preset_ (_TypeScript_ linter rules with _Codelyzer_)
    - **travis.yml** _Travis CI_ configuration


## <a name="2"></a>2 Building
The following command:
```Shell
npm run build
```
- starts _TSLint_ with _Codelyzer_ using _Angular TSLint Preset_
- starts _AoT compilation_ using _ngc_ compiler
- creates `dist` folder with all the files of distribution, following _Angular Package Format (APF) v5.0_:
```
└── dist
    ├── bundles
    |   ├── ng2-cache.umd.js
    |   ├── ng2-cache.umd.js.map
    |   ├── ng2-cache.umd.min.js
    |   └── ng2-cache.umd.min.js.map
    ├── esm5
    |   ├── ng2-cache.js
    |   └── ng2-cache.js.map
    ├── esm2015
    |   ├── ng2-cache.js
    |   └── ng2-cache.js.map
    ├── src
    |   └── **/*.d.ts
    ├── ng2-cache.d.ts
    ├── ng2-cache.metadata.json
    ├── LICENSE
    ├── package.json
    ├── public_api.d.ts
    └── README
```
To test locally the npm package before publishing:
```Shell
npm run pack:lib
```
Then you can install it in an app to test it:
```Shell
npm install [path]ng2-cache-[version].tgz
```

## <a name="3"></a>3 Publishing
Before publishing the first time:
- you can register your library on [Travis CI](https://travis-ci.org/): you have already configured `.travis.yml` file
- you must have a user on the _npm_ registry: [Publishing npm packages](https://docs.npmjs.com/getting-started/publishing-npm-packages)

```Shell
npm run publish:lib
```

## <a name="4"></a>4 Using the library
### Installing
```Shell
npm install ng2-cache --save 
```
### Loading
#### Using SystemJS configuration
```JavaScript
System.config({
    map: {
        'ng2-cache': 'node_modules/ng2-cache/bundles/ng2-cache.umd.js'
    }
});
```
#### Angular-CLI
No need to set up anything, just import it in your code.
#### Rollup or webpack
No need to set up anything, just import it in your code.
#### Plain JavaScript
Include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/ng2-cache/bundles/ng2-cache.umd.js"></script>
```
and use global `ng.ng2Cache` namespace.

### AoT compilation
The library is compatible with _AoT compilation_.

## <a name="5"></a>5 What it is important to know
1. `package.json`

    * `"main": "./bundles/ng2-cache.umd.js"` legacy module format 
    * `"module": "./esm5/ng2-cache.js"` flat _ES_ module, for using module bundlers such as _Rollup_ or _webpack_: 
    [package module](https://github.com/rollup/rollup/wiki/pkg.module)
    * `"es2015": "./esm2015/ng2-cache.js"` _ES2015_ flat _ESM_ format, experimental _ES2015_ build
    * `"peerDependencies"` the packages and their versions required by the library when it will be installed

2. `tsconfig.json` file used by _TypeScript_ compiler

    * Compiler options:
        * `"strict": true` enables _TypeScript_ `strict` master option

3. `tsconfig-build.json` file used by _ngc_ compiler

    * Compiler options:
        * `"declaration": true` to emit _TypeScript_ declaration files
        * `"module": "es2015"` & `"target": "es2015"` are used by _Rollup_ to create the _ES2015_ bundle

    * Angular Compiler Options:
        * `"skipTemplateCodegen": true,` skips generating _AoT_ files
        * `"annotateForClosureCompiler": true` for compatibility with _Google Closure compiler_
        * `"strictMetadataEmit": true` without emitting metadata files, the library will not be compatible with _AoT compilation_: it is intended to report syntax errors immediately rather than produce a _.metadata.json_ file with errors
        * `"flatModuleId": "@scope/package"` full package name has to include scope as well, otherwise AOT compilation will fail in the consumed application

4. `rollup.config.js` file used by _Rollup_

    * `format: 'umd'` the _Universal Module Definition_ pattern is used by _Angular_ for its bundles
    * `moduleName: 'ng.angularLibraryStarter'` defines the global namespace used by _JavaScript_ apps
    * `external` & `globals` declare the external packages


## License
MIT
