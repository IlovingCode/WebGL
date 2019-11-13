innerglow = {
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
	float radius = 0.02;
	uniform vec2 resolution;
	uniform vec2 mouse;

	vec4 zoom(sampler2D tex, vec2 d){
		float ratio = 1.;
		radius = time * 5.;
		float ax = d.x * d.x + d.y * d.y / (ratio * ratio);
		float dx = ax * ax / radius - ax;
		float f = ax + step(ax, radius) * (dx * 0.5);
		vec2 area = .5 + d * f / ax;
		return texture2D(tex, area);
	}

    void main() {
		vec2 uv = vUv - vec2(0.5);
		uv.y *= resolution.y / resolution.x;
		float d = uv.x * uv.x + uv.y * uv.y;
		d /= time;
		float c = step(d, 1.) * pow(d, 3.) * .5;
		float c2 = step(0.99, d) * .1 / pow(d, 3.);
		vec4 p = (1.0 - zoom(texture, uv * 2.)) + vec4(0.,.5,.5,.5);
		vec4 col = p * c + c2 * vec4(0.,1.,1.,1.);
        gl_FragColor = col * 2. + vec4(0, 0, 0, 1. - c);
	}`,

	texList: [
		{ path: 'soccer.jpg', location: 'texture' },
	],

	updateAttribute: function (dt) {
		param += dt;
		var loc1 = gl.getUniformLocation(shaderProg, 'time');
		//if (param > 0.3) param = 0.01;
		gl.uniform1f(loc1, Math.abs(Math.sin(param)) * 0.05);
	},
}