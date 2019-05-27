#version 300 es

precision highp float;

in vec3 vertex; // vertx
in vec3 vcolor; // normal

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 eyeNormal;

void main() {
    vec4 eyeSpaceVertex = modelViewMatrix * vec4(vertex, 1.0);
    vec4 normal = vec4(vcolor, 0.0);
    eyeNormal = transpose(inverse(modelViewMatrix)) * normal;
    gl_Position = projectionMatrix * eyeSpaceVertex;
}
