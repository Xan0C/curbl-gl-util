# curbl-gl-util
set of helper classes to work with webgl 2.0

* Creating a simple quad

```javascript
import {GLCube, WebGLUtil, GLShader} from "curbl-gl-util"

const canvas = document.createElement('canvas');

const gl = WebGLUtil.setupWebGL(canvas, {
    antialias: true,
    stencil: true,
    alpha: false
});

const shader = new GLShader(gl,
`#version 300 es
 #ifdef GL_ES
     precision mediump float;
 #endif
 
 layout(location = 0) in vec2 a_Position;
 
 out vec4 v_Position;
 
 void main() {
     v_Position = vec4(a_Position.xy, 0.0, 1.0);
     gl_Position = v_Position;
 }
`,
`
#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in vec4 v_Position;
out vec4 fragmentColor;

void main() {
    fragmentColor = v_Position;
}
`
);

shader.upload();

const quad = new GLCube(gl);

shader.bind();

quad.vertexArrayObject.bind();
quad.vertexArrayObject.addAttribute(
    quad.vertexBuffer,
    shader.attributes.getAttribute('a_Position'),
    2,
    gl.FLOAT,
    false,
    16,
    0
);
quad.vertexArrayObject.unbind();

quad.draw();

shader.unbind();

```