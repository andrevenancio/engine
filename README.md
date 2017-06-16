# engine
WebGL2 engine

## Development
Run `npm install` to install all dependencies specified in package.json.

Run `npm start` for development.

## Production
Run `npm run build` to generate the library and documentation.

## Implementation
INIT TIME
1) create all shaders and programs and look up locations
2) create buffers and upload vertex data
3) create a vertex array for each thing you want to draw.
    3.1) for each attribute call gl.bindBuffer, gl.vertexAttribPointer, gl.enableVertexAttribArray
    3.2) bind any indices to gl.ELEMENT_ARRAY_BUFFER
4) create textures and upload texture data

RENDER TIME
1) clear and set the viewport and other global state.
2) for each model you want to render
    2.1) call gl.useProgram
    2.2) bind the vertex array for that model
    2.3) call gl.uniformXXX for each uniform
    2.4) call gl.activeTexture and gl.bindTexture to assign textures to texture units
    2.5) call gl.drawArrays or gl.drawElements
