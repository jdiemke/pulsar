#version 300 es

precision highp float;

in vec4 eyeNormal;
in vec3 pos;
in vec3 oldPos;
out vec4 frag;


void main() {
    vec3 r = dot(normalize(eyeNormal.xyz), vec3(0.0, 0.0, 1.0))*2.0*normalize(eyeNormal.xyz) -vec3(0.0, 0.0, 1.0);
    vec3 color =  max(0.0,dot(normalize(eyeNormal.xyz), vec3(0.0, 0.0, 1.0)))* vec3(0.9, 0.4, 0.2)
    +vec3(0.03, 0.3, 0.2) + pow(max(0.0, dot(r, -normalize(pos))), 3.0)* vec3(0.8, 0.5, 0.7)*0.9;
    frag = vec4(color, 1.0);
}

