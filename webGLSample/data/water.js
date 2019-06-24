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
	float radius = 0.07;
	uniform vec2 resolution;
	uniform vec2 mouse;

    void main() { 
		vec2 d = vUv - mouse;
		float ratio = resolution.x / resolution.y;
		float ax = d.x * d.x + d.y * d.y / (ratio * ratio);
        //ax /= radius;
        
        vec2 uv = vec2(vUv.x, vUv.y);
        float a = ax - radius * time;
        a *= 3.141592 * 5.0;
        float t = time;

        float h = 1e-1;
        float d1 = a - h;
        float d2 = a + h;
        float p1 = sin(d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0.01, -0.3, d1);
        float p2 = sin(d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0.01, -0.3, d2);
        vec2 circles = normalize(d) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));

        float intensity = mix(0.01, 0.15, smoothstep(0.01, 0.6, abs(time*2.-1.)));
        vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));
        vec3 color = texture2D(texture, uv - intensity*n.xy).rgb + 5.*pow(clamp(dot(n, normalize(vec3(1., 0.7, 0.5))), 0., 1.), 6.);
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