wave = {
	vertexShaderText: `
	precision mediump float;
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
	uniform sampler2D disp;
	uniform float time;
	float radius = 0.04;
	uniform vec2 resolution;
	uniform vec2 mouse;

	vec3 a = vec3(1.,1.,0.);
	vec3 b = vec3(0.,1.,1.);
	float h = 1e-1;

    void main() {
		float t = smoothstep(1. - time - h, 1. - time + h, vUv.y + .1 * sin((vUv.x + time * 5.) * 6.283185));
		vec3 c = t * a + (1. - t) * b;
        gl_FragColor = vec4(c, 1.);
	}`,

	updateAttribute: function (dt) {
		param += dt * 0.1;
		var loc1 = gl.getUniformLocation(shaderProg, 'time');
		if (param > 1) param = 0;
		gl.uniform1f(loc1, param);
	},
}