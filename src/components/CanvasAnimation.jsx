import React, { useEffect, useRef } from 'react';

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  let gl;
  let dpr = window.devicePixelRatio;
  let time;
  let buffer;
  let program;
  let resolution;
  let vertices = [];

  const vertexSource = `#version 300 es
  precision highp float;

  in vec2 position;

  void main(void) {
      gl_Position = vec4(position, 0., 1.);
  }
  `;

  const fragmentSource = `#version 300 es
  precision highp float;

  uniform vec2 resolution;
  uniform float time;

  out vec4 fragColor;

  float hash21(vec2 p) {
    p = fract(p * vec2(324.967, 509.314));
    p += dot(p, p + 75.09);

    return fract(p.x * p.y);
  }

  float flip(vec2 p) {
    float rand = hash21(p);
    return rand > .5 ? 1.: -1.;
  }

  mat2 rot(in float a) {
    float s = sin(a),
    c = cos(a);

    return mat2(c, -s, s, c);
  }

  float cLength(vec2 p, float k) {
    p = abs(p);

    return pow((pow(p.x, k)+pow(p.y, k)), 1./k);
  }

  float circle(vec2 p, vec2 c, float r, float w, float b, float s, float k) {
    float d = cLength(p - c * (p.x > -p.y ? s: -s), k);

    return smoothstep(b, -b, abs(d - r) - w);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1., 2. / 3., 1. / 3., 3.);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6. - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, .0, 1.), c.y);
  }

  void main(void) {
    float t = time * .125;
    float f = .5 + .5 * sin(t);
    float zoom = 5.;
    float mn = min(resolution.x, resolution.y);
    float rhm = mn - mn * .9 * f;
    float px = zoom/rhm;
    vec2 uv = (
      gl_FragCoord.xy - .5 * resolution.xy
    ) / rhm;

    uv *= zoom;
    uv *= rot(time * .1);

    vec2 gv = fract(uv) - .5;
    vec2 id = floor(uv);
    vec2 oc = vec2(.5);

    gv.x *= flip(id);

    float sdf = circle(
      gv,
      oc,
      .5,
      .125,
      px + f * px * zoom,
      1.,
      (12. - 11. * smoothstep(.0, 1., .5+.5*cos(t)))
    );

    vec3 color = hsv2rgb(
      vec3(
        fract(2.-2.*f),
        1.,
        exp(log(sdf)) / (length(uv) * (1. - 1. * (f - .1)))
      )
    );

    fragColor = vec4(color, 1.0);
  }
  `;

  const setup = () => {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    program = gl.createProgram();

    gl.shaderSource(vs, vertexSource);
    gl.compileShader(vs);

    gl.shaderSource(fs, fragmentSource);
    gl.compileShader(fs);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    vertices = [
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      1.0, 1.0
    ];

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    time = gl.getUniformLocation(program, 'time');
    resolution = gl.getUniformLocation(program, 'resolution');
  };

  const draw = (now) => {
    gl.clearColor(0, 0, 0, 1.);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.uniform1f(time, now * 0.001);
    gl.uniform2f(resolution, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5);
  };

  const loop = (now) => {
    draw(now);
    requestAnimationFrame(loop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    gl = canvas.getContext('webgl2');

    setup();
    resize();

    const animate = (timestamp) => {
      loop(timestamp);
    };

    animate(0);

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const resize = () => {
    const canvas = canvasRef.current;
    const { innerWidth: width, innerHeight: height } = window;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    gl.viewport(0, 0, width * dpr, height * dpr);
  };

  return <canvas ref={canvasRef} />;
};

export default CanvasAnimation;
