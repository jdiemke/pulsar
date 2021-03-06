#version 300 es

precision highp float;

in vec4 vertex;
in vec2 texcoord;

out vec2 tex;
out vec4 col;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 color;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
    tex = texcoord;
    col = color;
}
