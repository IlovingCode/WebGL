bloom = {
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

	float intensity(sampler2D tex, vec2 uv){
		vec4 c = texture2D(tex, uv);
		return sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
	}

	vec4 blur(sampler2D tex, vec2 uv){
		float stepX = 3.0 / resolution.x;
		float stepY = 3.0 / resolution.y;
		// get samples around pixel
		vec4 tleft  = texture2D(tex,uv + vec2(-stepX,stepY));
		vec4 left   = texture2D(tex,uv + vec2(-stepX,0));
		vec4 bleft  = texture2D(tex,uv + vec2(-stepX,-stepY));
		vec4 top    = texture2D(tex,uv + vec2(0,stepY));
		vec4 bottom = texture2D(tex,uv + vec2(0,-stepY));
		vec4 tright = texture2D(tex,uv + vec2(stepX,stepY));
		vec4 right  = texture2D(tex,uv + vec2(stepX,0));
		vec4 bright = texture2D(tex,uv + vec2(stepX,-stepY));
	 
		vec4 color = tleft + left + bleft + tright + right + bright + top + bottom;
		color *= 0.125;
		return color;
	}

    void main() {
		float ratio = resolution.x / resolution.y;
		vec2 uv = vUv; 
		vec2 d = vUv - mouse;
		float ax = d.x * d.x + d.y * d.y / (ratio * ratio);
		ax /= radius;
		vec4 c = texture2D(texture, uv);
		vec4 b = blur(texture, uv);
		c = step(ax, 1.0) * mix(b + c, c, ax) + step(1.0, ax) * c;
        gl_FragColor = c;
    }`,

	texList: [
		{ path: 'dmap.jpg', location: 'disp' },
		{ path: 'intro_bar-cavour.jpg', location: 'texture' }],
}