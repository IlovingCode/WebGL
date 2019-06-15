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
	vec4 c1 = vec4(1.0, s, 1.0, 1.0);
	vec4 c2 = vec4(s, 1.0, 1.0, 1.0);
	vec4 c3 = vec4(1.0, 1.0, s, 1.0);
	vec4 c4 = vec4(s, s, 1.0, 1.0);
	vec4 c5 = vec4(1.0, s, s, 1.0);
	vec4 c6 = vec4(s, 1.0, s, 1.0);

	vec4 check(float t, float a, vec4 c) {
		return step(t, a) * step(a, t + 1.0) * c;
	}

    void main() {
		float ratio = resolution.x / resolution.y; 
		vec2 d = vUv - mouse;
		float l = length(d) * 3.0;
		float ax = d.x * d.x / 0.04 + d.y * d.y / ratio / ratio / 0.04;
		ax /= radius;
		float a = 1.0 + atan(d.x * ratio, d.y) * 0.318309886; // 1/Pi
		a *= time * 0.5;
        // atan: [-Pi, Pi] -> a: [0, 2.0 * a1f]
		vec4 c = 
			check(0.0 + l, a, c1)
          + check(1.0 + l, a, c2)
          + check(2.0 + l, a, c3)
          + check(3.0 + l, a, c4)
          + check(4.0 + l, a, c5)
		  + check(5.0 + l, a, c6)
		  + check(0.0 + l, time, c1) * step(a, l)
		  + check(1.0 + l, time, c2) * step(a, l)
		  + check(2.0 + l, time, c3) * step(a, l)
		  + check(3.0 + l, time, c4) * step(a, l)
		  + check(4.0 + l, time, c5) * step(a, l)
		  + check(5.0 + l, time, c6) * step(a, l)
        ;
        c.rgb *= step(0.1, fract(a - l)) * step(ax, 0.9);
		c = step(ax, 1.0) * c + step(1.0, ax) * vec4(0);
        gl_FragColor = c;
    }`,

	updateAttribute: function (dt) {
		param += dt;
		var loc1 = gl.getUniformLocation(shaderProg, 'time');
		gl.uniform1f(loc1, Math.floor(1 + Math.abs(param % 12 - 6)));
	},

	texList: [],
}

var param = 0;