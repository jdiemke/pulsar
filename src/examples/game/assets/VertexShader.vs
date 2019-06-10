#version 300 es

precision highp float;

in vec4 vertex;
in vec2 texcoord;
uniform vec3 position;
uniform vec4 color;

out vec2 tex;
out vec4 col;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

const float scale = 1.0;

void main() {
    vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
    vec3 up    = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));

    tex = texcoord;
    col = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4((right * vertex.x + up * vertex.y) * scale + position, 1.0);
}
