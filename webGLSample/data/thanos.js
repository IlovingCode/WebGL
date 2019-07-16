thanos = {
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
    uniform sampler2D disp;
    uniform float time;
	float radius = .03;
	uniform vec2 resolution;
	uniform vec2 mouse;

    void main() {
        float ratio = resolution.x / resolution.y;
        vec2 d = vUv - mouse;
        d.y /= ratio;
		float ax = d.x * d.x + d.y * d.y;
        
        float dx = ax * ax / radius - ax;
		float f = ax + step(ax, radius) * (dx * 0.5);
		vec2 area = vec2(mouse.x, mouse.y / ratio) + d * f / ax;

        float h = 1e-2;
        vec2 uv = area;
        float t = time;
        float r =  texture2D(disp, uv).r;
        float a = step(t - h, r) - step(t, r);
        vec3 c = vec3(a * t , a * t, a);

        t = fract(t + 0.33);
        a = step(t - h, r) - step(t, r);
        c += vec3(a * t , a, a * t);

        t = fract(t + 0.33);
        a = step(t - h, r) - step(t, r);
        c += vec3(a , a * t, a * t);
        
        gl_FragColor = vec4(c, 1.);
    }`,

    updateAttribute: function (dt) {
		param += dt * 0.3;
        var loc1 = gl.getUniformLocation(shaderProg, 'time');
        if(param > 1) param = 0;
		gl.uniform1f(loc1, param);
	},

	texList: [
		{ path: 'dmap.jpg', location: 'disp' }]
}

var param = 0;