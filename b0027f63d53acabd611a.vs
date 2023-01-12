#version 300 es

precision highp float;

in vec4 vertex;

void main() {
    gl_Position = vertex;
}
