var vertexShaderText = `
	precision mediump float;
    attribute vec2 a_position;
    attribute vec2 a_uv;
	varying vec2 vUv;

    void main() {
		vUv = a_uv;
        gl_Position = vec4(a_position, 1.0, 1.0);
	}`;

var fragmentShaderText = `
	precision mediump float;
    varying vec2 vUv;
	uniform sampler2D texture;
	uniform sampler2D disp;
	uniform float time;
	float radius = 1.0;
	uniform vec2 resolution;
	uniform vec2 mouse;

	float intensity(sampler2D tex, vec2 uv){
		vec4 c = texture2D(tex, uv);
		return sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
	}

	vec3 sobel(sampler2D tex, vec2 uv){
		float stepX = 1.0 / resolution.x;
		float stepY = 1.0 / resolution.y;
		// get samples around pixel
		float tleft  = intensity(tex,uv + vec2(-stepX,stepY));
		float left   = intensity(tex,uv + vec2(-stepX,0));
		float bleft  = intensity(tex,uv + vec2(-stepX,-stepY));
		float top    = intensity(tex,uv + vec2(0,stepY));
		float bottom = intensity(tex,uv + vec2(0,-stepY));
		float tright = intensity(tex,uv + vec2(stepX,stepY));
		float right  = intensity(tex,uv + vec2(stepX,0));
		float bright = intensity(tex,uv + vec2(stepX,-stepY));
	 
		float x = tleft + 0.1 * left + bleft - tright - 0.1 * right - bright;
		float y = -tleft - 0.1 * top - tright + bleft + 0.1 * bottom + bright;
		float color = sqrt(x * x + y * y);
		return vec3(0,color,color);
	}


    void main() {
		float ratio = resolution.x / resolution.y;
		vec2 uv = vUv; 
		vec2 d = vUv - mouse;
		float ax = d.x * d.x / 0.04 + d.y * d.y / ratio / ratio / 0.04;
		ax /= radius;
		vec4 c = texture2D(texture, uv);
		vec4 t = vec4(sobel(texture, uv), c.a);
		c = step(ax, 1.0) * mix(t, c, ax) + step(1.0, ax) * c;
        gl_FragColor = c;
    }`;

var updateAttribute = function () {
}

var texList = [
	{ path: 'dmap.jpg', location: 'disp' },
	{ path: 'intro_gruppo.jpg', location: 'texture' }];