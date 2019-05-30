#version 300 es

precision highp float;

uniform sampler2D utexture;
in vec2 tex;
out vec4 outColor;

void main() {
     outColor = texture(utexture, tex);
}
