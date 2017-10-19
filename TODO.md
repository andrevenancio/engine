TODO
======

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
* implement directional light                   ✔   4 Jul 2017
* implement shader-chunks across materials      ✔   19 Jul 2019
* implement normal maps
* implement OBJ loader to material
* implement instanced objects
* implement post processing
* avoid z-fighting
* adding subdivision `utils/geometry`
* implement ShaderToy material
* loaders should export geometry and material
* add debug mode to renderer
* implement alternative renderer for webgl1 and canvas.
* implement `three-point lighting`


# Lights to implement?
https://www.pluralsight.com/blog/film-games/understanding-different-light-types
Spot lights
Point lights
Area lights
Directional lights
    vec3 direction
    vec3 ambient
    vec3 specular
Volume lights
Ambient lights

# maybe...
Possibly rethink materials and simplify this to the bare minimum where the users create the shaders, and we only have one `factory` material.
Though this framework is optimised to reuse shaders when possible, might be better if functionality gets stripped to the bare minimum.
Lights, utils, all of that can be external modules.

remove vector3 and just use vec3 no point adding complexity to simplify user api
