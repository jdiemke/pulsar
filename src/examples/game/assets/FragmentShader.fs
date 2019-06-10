#version 300 es

precision highp float;

in vec2 tex;
in vec4 col;

out vec4 frag;

uniform sampler2D utexture;

void main() {
    frag = texture(utexture, tex) * col;
}

