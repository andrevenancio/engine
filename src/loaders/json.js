import File from './file';
import { generateVertexNormals } from '../utils/geometry';

class JsonLoader {

    static load(url, callback) {
        File.load(url).then((raw) => {
            callback(JsonLoader.parse(raw));
        });
    }

    static parse(raw) {
        const data = JSON.parse(raw);

        if (data.normals === undefined) {
            data.normals = generateVertexNormals(data.positions, data.indices);
        }

        const { positions, indices, normals } = data;
        return {
            positions,
            indices,
            normals,
        };
    }

}

export default JsonLoader;
