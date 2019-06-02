#version 300 es

precision highp float;

in vec4 eyeNormal;
in vec3 pos;
in vec3 oldPos;
out vec4 frag;

uniform sampler2D utexture;
uniform sampler2D utexture2;
in vec2 tex;
const float PI = 3.1415926535897932384626433832795;

void main() {
    frag =  texture(utexture, tex)*vec4(1.0, 1.0, 1.0, 1.0);
}

