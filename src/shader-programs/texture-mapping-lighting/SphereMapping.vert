#version 300 es

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec4 vertex;
in vec2 texcoord;
in vec3 normal;
out vec2 tex;
out vec3 color;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
    tex = texcoord;
    vec4 n = vec4(normal, 0.0);
    vec4 eyeNormal = transpose(inverse(modelViewMatrix)) * n;
    color =  vec3(max(0.0,dot(normalize(eyeNormal.xyz), normalize(vec3(1.0, 1.0, 2.0))))) + vec3(0.15, 0.1, 0.1);
}
