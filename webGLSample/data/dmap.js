dmap = {
    vertexShaderText: `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    varying vec2 vUv;
    void main() {
        vUv = a_uv;
        gl_Position = vec4(a_position, 1.0, 1.0);
	}`,

    fragmentShaderText: `
	precision mediump float;
    varying vec2 vUv;
    uniform sampler2D texture;
    uniform sampler2D texture2;
    uniform sampler2D disp;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() { 
		vec2 uv = vUv;
		vec2 dir = vec2(uv.x - 0.5, uv.y - 0.5) * -effectFactor;
		dir *= dispFactor;
        vec4 disp = texture2D(disp, uv);
		vec2 distortedPosition = vec2(uv.x + dispFactor * disp.r * dir.x, 
									uv.y + dispFactor * disp.r * dir.y);
		vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * disp.r * dir.x, 
									uv.y - (1.0 - dispFactor) * disp.r * dir.y);
        vec4 _texture = texture2D(texture, distortedPosition);
        vec4 _texture2 = texture2D(texture2, distortedPosition2);
        vec4 finalTexture = mix(_texture, _texture2, dispFactor);
        gl_FragColor = finalTexture;
    }`,

    updateAttribute: function (dt) {
        param1 += dt;
        if (param1 > 5) param1 = 0;

        var loc1 = gl.getUniformLocation(shaderProg, 'dispFactor');
        gl.uniform1f(loc1, param1 < 3 ? (param1 > 2 ? (param1 - 2) : 0) : 1);

        var loc2 = gl.getUniformLocation(shaderProg, 'effectFactor');
        gl.uniform1f(loc2, param2);
    },

    texList: [
        { path: 'dmap.jpg', location: 'disp' },
        { path: 'intro_bar-cavour.jpg', location: 'texture' },
        { path: 'intro_gruppo.jpg', location: 'texture2' }],
}

var param1 = 0;
var param2 = 0.7;