import { vec3 } from 'gl-matrix';
import Object3 from '../core/object3';
import Model from '../core/model';
import Basic from '../material/basic';
import Line from '../geometry/line';
import { GL_LINES } from '../session';

class AxisHelper extends Object3 {
    constructor(props) {
        super();
        const size = (props && props.size) || 1;
        const g1 = new Line(vec3.fromValues(0, 0, 0), vec3.fromValues(size, 0, 0));
        const g2 = new Line(vec3.fromValues(0, 0, 0), vec3.fromValues(0, size, 0));
        const g3 = new Line(vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, size));

        const m1 = new Basic({ color: 0xff0000 });
        const m2 = new Basic({ color: 0x00ff00 });
        const m3 = new Basic({ color: 0x0000ff });

        const x = new Model(g1, m1);
        this.addModel(x);

        const y = new Model(g2, m2);
        this.addModel(y);

        const z = new Model(g3, m3);
        this.addModel(z);

        x.material.glMode = GL_LINES;
        y.material.glMode = GL_LINES;
        z.material.glMode = GL_LINES;
    }
}
export default AxisHelper;
