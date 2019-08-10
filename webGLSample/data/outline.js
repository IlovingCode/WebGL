outline = {
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

	vec4 outline(sampler2D tex, vec2 uv){
		float a = 0.;
		for(float i = 1.; i < 7.; i++){
			float stepX = i / resolution.x;
			float stepY = i / resolution.y;
			a += texture2D(tex, uv + vec2( stepX,  stepY)).a;
			a += texture2D(tex, uv + vec2(-stepX,  stepY)).a;
			a += texture2D(tex, uv + vec2(-stepX, -stepY)).a;
			a += texture2D(tex, uv + vec2( stepX, -stepY)).a;

			a += texture2D(tex, uv + vec2( stepX, 0.)).a;
			a += texture2D(tex, uv + vec2(-stepX, 0.)).a;
			a += texture2D(tex, uv + vec2( 0.,  stepY)).a;
			a += texture2D(tex, uv + vec2( 0., -stepY)).a;
		}

		a *= 0.1 * time;
		a *= exp(a);
		return vec4(a, a, 0., 1.);
	}


    void main() {
		float ratio = resolution.x / resolution.y;
		vec2 uv = vUv; 
		vec2 d = vUv - mouse;
		float ax = d.x * d.x + d.y * d.y / (ratio * ratio);
		ax /= radius;
		vec4 c = texture2D(texture, uv);
		vec4 t = outline(texture, uv);
		c = c * c.a + t * (1. - c.a);
        gl_FragColor = c;
	}`,

	updateAttribute: function (dt) {
		param += dt * 0.7;
		var loc1 = gl.getUniformLocation(shaderProg, 'time');
		if (param > 1) param = -param;
		gl.uniform1f(loc1, Math.abs(param));
	},

	filter: 'LINEAR',

	texList: [
		{ path: 'a.png', location: 'texture' }],
}