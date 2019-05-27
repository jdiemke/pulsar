#version 300 es

precision highp float;

in vec4 eyeNormal;

uniform sampler2D utexture;

out vec4 frag;
const float PI = 3.1415926535897932384626433832795;
void main() {
    vec3 normal = normalize(eyeNormal.xyz);
    vec3 color = texture(utexture, 
          vec2(0.5 + asin(normal.x) / PI, 0.5 - asin(normal.y) / PI)
    ).xyz;
    frag = vec4(color,  1.0);
}

