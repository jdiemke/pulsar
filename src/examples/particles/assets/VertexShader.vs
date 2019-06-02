#version 300 es

precision highp float;

in vec4 vertex;
in vec3 vcolor;
in vec2 texcoord;

out vec2 tex;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 eyeNormal;
out vec3 pos;
out vec3 oldPos;


void main() {
    mat4 modelViewMatrix2 = modelViewMatrix;

    vec3 right = vec3(modelViewMatrix2[0][0], modelViewMatrix2[1][0], modelViewMatrix2[2][0]);
    vec3 up = vec3(modelViewMatrix2[0][1], modelViewMatrix2[1][1], modelViewMatrix2[2][1]);


    gl_Position = projectionMatrix * modelViewMatrix2 * vec4(right *vertex.x + up * vertex.y,1.0);
    tex = texcoord;
}
