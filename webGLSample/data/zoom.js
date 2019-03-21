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
	float radius = 2.0;
	uniform float ratio;
	uniform vec2 mouse;
    void main() { 
		vec2 d = vUv - mouse;
		float ax = d.x * d.x / 0.04 + d.y * d.y / ratio / ratio / 0.04;
		float dx = ax * ax / (2.0 * radius) - ax / 2.0;
		float f = ax + step(ax, radius) * dx;
		vec2 area = mouse + d * f / ax;
        gl_FragColor = texture2D(texture, area);
    }`;

    var texList = [
        { path: 'intro_bar-cavour.jpg', location: 'texture' }];