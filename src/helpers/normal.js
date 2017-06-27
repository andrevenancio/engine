import Model from '../core/model';
import Basic from '../material/basic';
import { getContext } from '../session';

class NormalHelper extends Model {

    constructor(mesh, size = 1, color = 0xffffff) {
        let geometry = {
            positions: [],
        };

        // extract geometry
        const sx = mesh.scale.x;
        const sy = mesh.scale.y;
        const sz = mesh.scale.z;

        const length = mesh.geometry.normals.length / 3;
        for (let i = 0; i < length; i += 1) {
            const i3 = i * 3;
            const v0x = sx * mesh.geometry.positions[i3 + 0];
            const v0y = sy * mesh.geometry.positions[i3 + 1];
            const v0z = sz * mesh.geometry.positions[i3 + 2];
            const nx = mesh.geometry.normals[i3 + 0];
            const ny = mesh.geometry.normals[i3 + 1];
            const nz = mesh.geometry.normals[i3 + 2];
            const v1x = v0x + size * nx;
            const v1y = v0y + size * ny;
            const v1z = v0z + size * nz;
            geometry.positions = geometry.positions.concat([v0x, v0y, v0z, v1x, v1y, v1z]);
        }

        const material = new Basic({
            color,
        });
        super(geometry, material);
    }

    draw() {
        const gl = getContext();
        gl.drawArrays(gl.LINES, 0, this.geometry.positions.length / 3);
    }

}
export default NormalHelper;
