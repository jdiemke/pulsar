#version 300 es

precision mediump float;

uniform sampler2D utexture;
in vec2 tex;
in float z;
out vec4 outColor;

void main() {
    outColor = vec4(clamp(mix(texture(utexture, tex).rgb, vec3(0.28, 0.23, 0.21), clamp(z*0.03+0.2, 0.0, 1.0)), vec3(0,0,0),vec3(1,1,1)), 1.0);
}

