class Line {

    constructor(from, to) {
        const positions = [];
        positions.push(from[0] || 0, from[1] || 0, from[2] || 0);
        positions.push(to[0] || 0, to[1] || 0, to[2] || 0);

        return {
            positions,
            indices: [],
        };
    }

}

export default Line;
