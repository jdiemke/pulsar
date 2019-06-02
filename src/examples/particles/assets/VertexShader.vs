#version 300 es

precision highp float;

in vec4 vertex;
in vec3 vcolor;
in vec2 texcoord;

out vec2 tex;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
in vec3 position;

out vec4 eyeNormal;
out vec3 pos;
out vec3 oldPos;

void main() {
    vec3 right = 0.62*normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
    vec3 up =0.62* normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
    vec4 vertex = vec4(right * vertex.x + up * vertex.y + position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
    tex = texcoord;
}
