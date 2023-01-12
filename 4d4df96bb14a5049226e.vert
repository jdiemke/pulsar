#version 300 es

precision highp float;

in vec4 vertex;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 eyeNormal;

void main() {
    eyeNormal = modelViewMatrix * vec4(normal, 0.0); //transpose(inverse(modelViewMatrix)) * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
}
