convert = {
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

	vec3 rgb2hsv (vec3 c) {
		vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
		vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
		vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
	
		float d = q.x - min(q.w, q.y);
		float e = 1.0e-10;
		return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
	}
	
	vec3 hsv2rgb (vec3 c) {
		vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
		vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
		return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
	}
	
	void main() {
		vec4 px = texture2D(texture, vUv);
		vec4 mx = texture2D(texture, mouse);
	
		float r = 0.05;
		float t = 0.2;
			
		vec3 hsv = rgb2hsv (px.rgb);
		vec3 tar = rgb2hsv (mx.rgb);
		vec3 xcg = rgb2hsv (vec3 (1.0, 0.0, 0.0));
		
		float d = distance (hsv.x, tar.x);
		hsv.x = xcg.x;
		
			
		gl_FragColor = mix (vec4 (hsv2rgb (hsv), 1.0), px, smoothstep (t-r, t+r, d));	
	}`,

	texList: [
		{ path: 'dmap.jpg', location: 'disp' },
		{ path: 'intro_bar-cavour.jpg', location: 'texture' }],
}