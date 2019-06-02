#version 300 es

precision highp float;

in vec4 vertex; // vertx
in vec3 vcolor; // normal

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 eyeNormal;

void main() {
    vec4 normal = vec4(vcolor, 0.0);
    eyeNormal = modelViewMatrix * normal; //transpose(inverse(modelViewMatrix)) * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
}
