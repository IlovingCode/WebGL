zoom = {
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
	float radius = 0.04;
	uniform vec2 resolution;
	uniform vec2 mouse;

	float rand(vec2 co){
		return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

    void main() { 
		vec2 d = vUv - mouse;
		float ratio = resolution.x / resolution.y;
		float ax = d.x * d.x + d.y * d.y / (ratio * ratio);
		float dx = ax * ax / radius - ax;
		float f = ax + step(ax, radius) * (dx * 0.5);
		vec2 area = mouse + d * f / ax;
        gl_FragColor = texture2D(texture, area);
    }`,

	texList: [
		{ path: 'intro_bar-cavour.jpg', location: 'texture' }]
}