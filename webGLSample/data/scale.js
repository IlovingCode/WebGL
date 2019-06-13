scale = {

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
	uniform vec2 resolution;
	uniform vec2 mouse;

	float PI = 3.141592;

	float rand(vec2 co){
		return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

    void main() {
		vec2 uv = vUv; 
		vec2 n = normalize(uv - mouse);
		float length = length(uv - mouse);
		float a = PI * time * 0.5;
		vec2 n2 = vec2(0.0);
		n2.x = n.x * cos(a) - n.y * sin(a);
		n2.y = n.x * sin(a) + n.y * cos(a);
		vec4 dmap = texture2D(disp, n2);
		uv += n2 * time * time  + dmap.r * length * 0.1;
		vec4 c= texture2D(texture, uv);
		c *= step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
		dmap *= step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
		c = mix(dmap, c, 0.8);
        gl_FragColor = c;
    }`,


	updateAttribute: function (dt) {
		param += dt * 0.5;
		var loc1 = gl.getUniformLocation(shaderProg, 'time');
		gl.uniform1f(loc1, param - Math.floor(param));
	},

	texList: [
		{ path: 'dmap.jpg', location: 'disp' },
		{ path: 'intro_bar-cavour.jpg', location: 'texture2' },
		{ path: 'intro_gruppo.jpg', location: 'texture' }],
}
var param = 0;