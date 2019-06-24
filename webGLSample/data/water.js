water = {
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
    uniform float time;
	float radius = .07;
	uniform vec2 resolution;
	uniform vec2 mouse;

    void main() {
        float ratio = resolution.x / resolution.y;
		vec2 d = (vUv - mouse) * vec2(ratio, 1.);
		float ax = d.x * d.x + d.y * d.y;
        //ax /= radius;
        
        vec2 uv = vec2(vUv.x, vUv.y);
        float t = time;
        float a = ax - radius * t;
        a *= 3.141592 * 10.;

        float h = 1e-2;
        float d1 = a - h;
        float d2 = a + h;
        float p1 = sin(d1) * smoothstep(-.5, -.1, d1) * smoothstep(-.1, -.5, d1);
        float p2 = sin(d2) * smoothstep(-.5, -.1, d2) * smoothstep(-.1, -.5, d2);
        vec2 circles = t * (1. - t) * normalize(d) * (p2 - p1);

        vec3 color = texture2D(texture, uv - circles).rgb;
        //vec3 colord = vec3(uv - circles, 0.) * 1.;
        gl_FragColor = vec4(color, 1.0);
    }`,

    updateAttribute: function (dt) {
		param += dt;
		var loc1 = gl.getUniformLocation(shaderProg, 'time');
		gl.uniform1f(loc1, param - Math.floor(param));
	},

	texList: [
		{ path: 'intro_bar-cavour.jpg', location: 'texture' }]
}

var param = 0;