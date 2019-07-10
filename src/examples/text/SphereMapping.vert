#version 300 es

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec4 vertex;
in vec2 texcoord;
in vec4 color;
out vec2 tex;
out vec4 col;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
    tex = texcoord;
    col = color;
}
