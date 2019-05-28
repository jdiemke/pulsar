#version 300 es

precision highp float;

in vec3 vertex; // vertx
in vec3 normal; // normal
in vec2 texcoord; // normal

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 tex;

void main() {
    vec4 eyeSpaceVertex = modelViewMatrix * vec4(vertex, 1.0);
    tex = texcoord;
    gl_Position = projectionMatrix * eyeSpaceVertex;
}
