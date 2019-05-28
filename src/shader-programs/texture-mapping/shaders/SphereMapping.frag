#version 300 es

precision highp float;

in vec2 tex;

uniform sampler2D utexture;

out vec4 frag;

void main() {
    vec3 color = texture(utexture,tex).xyz;
    frag = vec4(color,  1.0);
}

