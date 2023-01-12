#version 300 es

precision highp float;

uniform sampler2D utexture;
in vec2 tex;
in vec4 col;
out vec4 outColor;

void main() {
     outColor = texture(utexture, tex) * col;
}
