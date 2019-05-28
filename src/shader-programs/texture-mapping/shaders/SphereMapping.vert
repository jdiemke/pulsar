#version 300 es

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec4 vertex;
in vec2 texcoord;

out vec2 tex;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
    tex = texcoord;
}
