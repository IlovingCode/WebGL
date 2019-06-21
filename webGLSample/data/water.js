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
	float radius = 0.04;
	uniform vec2 resolution;
	uniform vec2 mouse;

    float intensity(sampler2D tex, vec2 uv){
		vec4 c = texture2D(tex, uv);
		return sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
    }
    
    vec2 normal(sampler2D tex, vec2 uv){
        float p = intensity(tex, uv);
        float h = intensity(tex, uv + vec2(1.0 / resolution.x, 0.0));
        float v = intensity(tex, uv + vec2(0.0, 1.0 / resolution.y));

        return (p - vec2(h, v)) * 5.0 + 0.5;
    }

    void main() { 
        vec2 uv = vUv + time;
		vec2 d = vUv - mouse;
		float ratio = resolution.x / resolution.y;
		float ax = d.x * d.x + d.y * d.y / (ratio * ratio);
        ax /= radius;
		vec2 displacement = clamp((normal(texture, uv) - 0.5) * 0.12, -1.0, 1.0);
        gl_FragColor = texture2D(texture, vUv + displacement + time / 6.0);
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