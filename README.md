engine
========
<p align="center">
    <a href="https://github.com/andrevenancio/engine/blob/develop/LICENCE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="licence"/></a>
    <a href="https://travis-ci.org/andrevenancio/engine"><img src="https://travis-ci.org/andrevenancio/engine.svg" alt="Travis Status"></a>
    <a href="https://david-dm.org/andrevenancio/engine"><img src="https://david-dm.org/andrevenancio/engine.svg" alt="Dependency Status"></a>
    <a href="https://david-dm.org/andrevenancio/engine/?type=dev"><img src="https://david-dm.org/andrevenancio/engine/dev-status.svg" alt="devDependency Status"></a>
</p>

## WebGL 2.0
`engine` is a WebGL 2 **only** 3d engine.

[Examples](https://andrevenancio.github.io/engine/examples/) | [Documentation](https://andrevenancio.github.io/engine/docs/)

## Development
Run `npm install` to install all dependencies specified in package.json.

Run `npm start` for development.

## Production
Run `npm run build` to generate the library and documentation.

## TODO
* implement basic material                      ✔   19 Jun 2017
* implement UBO's.                              ✔   19 Jun 2017
* implement FlatShading material                ✔   20 Jun 2017
* add geometry generators                       ✔   20 Jun 2017
* implement textures                            ✔   20 Jun 2017
* implement texture maps                        ✔   20 Jun 2017
* implement Spherical Environment Mapping       ✔   20 Jun 2017
* implement JSON loader                         ✔   20 Jun 2017
* implement normal helper                       ✔   20 Jun 2017
* implement render targets                      ✔   26 Jun 2017
* implement normal maps
* implement OBJ loader to material
* implement instanced objects
* implement lights
* implement post processing
* avoid z-fighting
* adding subdivision `utils/geometry`
* implement shader-chunks across materials
* implement ShaderToy material
* loaders should export geometry and material
