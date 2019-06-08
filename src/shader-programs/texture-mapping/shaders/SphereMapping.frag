#version 300 es

precision mediump float;

uniform sampler2D utexture;
in vec2 tex;
in float z;
out vec4 outColor;

void main() {
    outColor =texture(utexture, tex);
}

