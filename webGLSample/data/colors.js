colors = {
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
	float radius = 0.5;
	uniform vec2 resolution;
	uniform vec2 mouse;

	float s = 0.392156;
	vec3 c1 = vec3(1.0, s, 1.0);
	vec3 c2 = vec3(s, 1.0, 1.0);
	vec3 c3 = vec3(1.0, 1.0, s);
	vec3 c4 = vec3(s, s, 1.0);
	vec3 c5 = vec3(1.0, s, s);
	vec3 c6 = vec3(s, 1.0, s);

    void main() {
		float ratio = resolution.x / resolution.y; 
		vec2 d = vUv - mouse;
		float ax = d.x * d.x / 0.04 + d.y * d.y / ratio / ratio / 0.04;
		ax /= radius;
		float a = atan(d.x * ratio, d.y) / 3.14159265359 + 1.0;
		a *= floor(time);
		a = floor(a);
		vec4 c = vec4(0.0, 0.0, 0.0, 1.0);
		vec3 t = //vec3(a, a, a)
				+step(a, 1.0) * c1 
				+step(1.01, a) * step(a, 3.0) * c2
				+step(3.01, a) * step(a, 5.0) * c3
				+step(5.01, a) * step(a, 7.0) * c4
				+step(7.01, a) * step(a, 9.0) * c5
				+step(9.01, a) * c6
				;
		t *= step(1.0, ax) * 2.0 + 1.0;
		c = step(ax, 1.1) * vec4(t, c.a) + step(1.1, ax) * c;
        gl_FragColor = c;
    }`,

	updateAttribute: function (dt) {
		param += dt * 3;
		var loc1 = gl.getUniformLocation(shaderProg, 'time');
		gl.uniform1f(loc1, Math.abs(param % 14 - 7));
	},

	texList: [],
}

var param = 0;