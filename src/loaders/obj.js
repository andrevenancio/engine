import File from './file';

class ObjLoader {
    static load(url, callback) {
        File.load(url).then((raw) => {
            callback(ObjLoader.parse(raw));
        });
    }

    static parse(raw) {
        // credits: https://raw.githubusercontent.com/frenchtoast747/webgl-obj-loader/master/webgl-obj-loader.js
        const verts = [];
        const vertNormals = [];
        const textures = [];
        const unpacked = {};

        unpacked.verts = [];
        unpacked.norms = [];
        unpacked.textures = [];
        unpacked.hashindices = {};
        unpacked.indices = [];
        unpacked.index = 0;

        const lines = raw.split('\n');

        const VERTEX_RE = /^v\s/;
        const NORMAL_RE = /^vn\s/;
        const TEXTURE_RE = /^vt\s/;
        const FACE_RE = /^f\s/;
        const WHITESPACE_RE = /\s+/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const elements = line.split(WHITESPACE_RE);
            elements.shift();

            if (VERTEX_RE.test(line)) {
                verts.push.apply(verts, elements); // eslint-disable-line
            } else if (NORMAL_RE.test(line)) {
                vertNormals.push.apply(vertNormals, elements); // eslint-disable-line
            } else if (TEXTURE_RE.test(line)) {
                textures.push.apply(textures, elements); // eslint-disable-line
            } else if (FACE_RE.test(line)) {
                let quad = false;
                for (let j = 0; j < elements.length; j++) {
                    if (j === 3 && !quad) {
                        j = 2;
                        quad = true;
                    }

                    if (elements[j] in unpacked.hashindices) {
                        unpacked.indices.push(unpacked.hashindices[elements[j]]);
                    } else {
                        const vertex = elements[j].split('/');

                        unpacked.verts.push(+verts[((vertex[0] - 1) * 3) + 0]);
                        unpacked.verts.push(+verts[((vertex[0] - 1) * 3) + 1]);
                        unpacked.verts.push(+verts[((vertex[0] - 1) * 3) + 2]);

                        if (textures.length) {
                            unpacked.textures.push(+textures[((vertex[1] - 1) * 2) + 0]);
                            unpacked.textures.push(+textures[((vertex[1] - 1) * 2) + 1]);
                        }

                        unpacked.norms.push(+vertNormals[((vertex[2] - 1) * 3) + 0]);
                        unpacked.norms.push(+vertNormals[((vertex[2] - 1) * 3) + 1]);
                        unpacked.norms.push(+vertNormals[((vertex[2] - 1) * 3) + 2]);

                        unpacked.hashindices[elements[j]] = unpacked.index;
                        unpacked.indices.push(unpacked.index);

                        unpacked.index++;
                    }
                    if (j === 3 && quad) {
                        unpacked.indices.push(unpacked.hashindices[elements[0]]);
                    }
                }
            }
        }

        return {
            positions: unpacked.verts,
            indices: unpacked.indices,
            normals: unpacked.norms,
            uvs: unpacked.textures,
        };
    }
}

export default ObjLoader;
