#version 300 es

precision highp float;

in vec2 tex;
in vec4 col;
in float z;

out vec4 frag;

uniform sampler2D utexture;

void main() {
    vec4 texel = texture(utexture, tex);

    if (texel.a < 0.5) {
        discard;
    }

    frag = vec4(clamp(mix(texel.rgb * col.rgb, vec3(0.18, 0.33, 0.11), clamp(z*0.012+0.1, 0.0, 1.0)), vec3(0,0,0),vec3(1,1,1)), 1.0);;
    
}

