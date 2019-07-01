#version 300 es

precision mediump float;

uniform sampler2D utexture;
in vec2 tex;
in vec3 color;
out vec4 outColor;

void main() {
    outColor =texture(utexture, tex) * vec4(color, 1.0);
}

