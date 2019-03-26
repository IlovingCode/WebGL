var vertexShaderText = `
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
	float radius = 1.0;
	uniform float ratio;
	uniform vec2 mouse;

	float rand(vec2 co){
		return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

    void main() { 
		vec2 d = vUv - mouse;
		float ax = d.x * d.x / 0.04 + d.y * d.y / ratio / ratio / 0.04;
		float dx = ax * ax / (2.0 * radius) - ax / 2.0;
		float f = ax + step(ax, radius) * (dx + rand(vUv) * 0.02);
		vec2 area = mouse + d * f / ax;
        gl_FragColor = texture2D(texture, area);
    }`;

    var texList = [
        { path: 'intro_bar-cavour.jpg', location: 'texture' }];