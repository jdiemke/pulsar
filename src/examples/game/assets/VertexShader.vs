#version 300 es

precision highp float;

in vec3 vertex;
in vec2 texcoord;
uniform vec3 position;
uniform vec4 color;

out vec2 tex;
out vec4 col;
out float z;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float scale;

void main() {
    vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
    vec3 up    = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));

    tex = texcoord;
    col = color;
    z = length((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4((right * vertex.x + up * vertex.y) * scale + position, 1.0);
}
