////////////////////////////Pass your shader here////////////////////////////////////

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

	var updateAttribute = function (dt) {}

var texList = [
	{ path: 'dmap.jpg', location: 'disp' },
	{ path: 'intro_bar-cavour.jpg', location: 'texture2' },
	{ path: 'intro_gruppo.jpg', location: 'texture' }];

/////////////////////// app.js main code //////////////////////////////////////

var gl = null;
var indiceCount = 0;
var shaderProg = null;

var compileShader = function (vert, frag) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vert);
	gl.shaderSource(fragmentShader, frag);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	return program;
};

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

var canvas = null;

var InitDemo = function () {
	console.log('This is working');
	canvas = document.getElementById('game-surface');
	handleTouch(canvas);
	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	!gl && alert('Your browser does not support WebGL');
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// Create shaders
	shaderProg = compileShader(vertexShaderText, fragmentShaderText);

	// Create buffer
	var vertices =
		[//	X,		Y,       TextCoord
			-1.0, -1.0, 0.0, 1.0,
			-1.0, 1.0, 0.0, 0.0,
			1.0, 1.0, 1.0, 0.0,
			1.0, -1.0, 1.0, 1.0,
		];

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var posLoc = gl.getAttribLocation(shaderProg, 'a_position');
	var texcoordLoc = gl.getAttribLocation(shaderProg, 'a_uv');
	gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, gl.FALSE,
		4 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, gl.FALSE,
		4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(posLoc);
	gl.enableVertexAttribArray(texcoordLoc);

	var indices = [0, 1, 2, 0, 2, 3];
	indiceCount = indices.length;

	var indice_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indice_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	let jobs = [];
	gl.useProgram(shaderProg);

	if (texList) {
		for (let i in texList)
			jobs.push(new Promise((resolve, reject) => {
				loadTexture(i, texList[i], resolve, reject);
			}));

		Promise.all(jobs).then(() => {
			draw(0);
		});
	} else draw(0);
};

var loadTexture = function (id, data, resolve, reject) {
	var image = new Image();
	image.addEventListener('load', function () {
		var tex = gl.createTexture();
		gl.activeTexture(gl['TEXTURE' + id]);
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
		var textureLoc = gl.getUniformLocation(shaderProg, data.location);

		// Main render loop
		gl.uniform1i(textureLoc, id);
		resolve();
	});
	image.addEventListener('error', function () {
		reject();
	});
	image.src = data.path;
};

var timer = 0;

var draw = function (dt) {
	!timer && (timer = dt);
	updateAttribute && updateAttribute((dt - timer) / 1000);
	timer = dt;
	gl.drawElements(gl.TRIANGLES, indiceCount, gl.UNSIGNED_SHORT, 0);
	window.requestAnimationFrame(draw);
};

var handleTouch = function (el) {
	el.addEventListener("touchstart", handleStart, false);
	el.addEventListener("touchend", handleEnd, false);
	el.addEventListener("touchcancel", handleEnd, false);
	el.addEventListener("touchmove", handleMove, false);
	el.addEventListener("mousemove", handleMove, false);
}

var handleStart = function (evt) {
	console.log('touchstart');
}

var handleMove = function (evt) {
	console.log('touchmove');
	var loc2 = gl.getUniformLocation(shaderProg, 'mouse');
	gl.uniform2f(loc2, evt.x / canvas.width, evt.y / canvas.height);

	var loc3 = gl.getUniformLocation(shaderProg, 'ratio');
	var ratio = canvas.width / canvas.height;
	gl.uniform1f(loc3, ratio);
}

var handleEnd = function (evt) {
	console.log('touchend');
}

window.addEventListener('resize', () => {
	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
window.addEventListener('load', () => {
	InitDemo();
	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});