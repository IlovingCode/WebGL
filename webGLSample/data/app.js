//import {vertexShaderText, fragmentShaderText} from './dmap.js';

var vertexShaderText = `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    varying vec2 vUv;
    void main() {
        vUv = a_uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(a_position, 1.0 );
	}`;
	
var fragmentShaderText = `
    varying vec2 vUv;
    uniform sampler2D texture;
    uniform sampler2D texture2;
    uniform sampler2D disp;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() { 
        vec2 uv = vUv;
        vec4 disp = texture2D(disp, uv);
        vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
        vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
        vec4 _texture = texture2D(texture, distortedPosition);
        vec4 _texture2 = texture2D(texture2, distortedPosition2);
        vec4 finalTexture = mix(_texture, _texture2, dispFactor);
        gl_FragColor = finalTexture; 
    }`;

var gl = null;
var indiceCount = 0;
var shaderProg = null;

var compileShader = function(vert, frag) {
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

var InitDemo = function() {
	console.log('This is working');
	var canvas = document.getElementById('game-surface');
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

	loadTexture(0, 'dmap.jpg', 'texture');
};

var loadTexture = function(id, path, location, callback) {
	var image = new Image();
	image.addEventListener('load', function() {
		var tex = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		var textureLoc = gl.getUniformLocation(shaderProg, location);
	
		// Main render loop
		gl.useProgram(shaderProg);
		gl.uniform1i(textureLoc, id);
		callback && callback();
	});
	image.src = path;
};

var draw = function (dt) {
	gl.drawElements(gl.TRIANGLES, indiceCount, gl.UNSIGNED_SHORT, 0);
	window.requestAnimationFrame(draw);
};