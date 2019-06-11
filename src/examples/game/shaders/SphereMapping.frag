#version 300 es

precision mediump float;

uniform sampler2D utexture;
in vec2 tex;
in float z;
out vec4 outColor;
in vec4 col;

void main() {
    outColor = vec4(clamp(mix(texture(utexture, tex).rgb * col.rgb, vec3(0.18, 0.33, 0.11), clamp(z*0.012+0.1, 0.0, 1.0)), vec3(0,0,0),vec3(1,1,1)), 1.0);
}

