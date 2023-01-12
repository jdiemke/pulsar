#version 300 es

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec4 color;

in vec4 vertex;
in vec2 texcoord;

out vec2 tex;
out float z;
out vec4 col;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
    z = length((modelViewMatrix * vertex).xyz);
    tex = texcoord;
    col = color;

}
