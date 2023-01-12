#version 300 es

precision highp float;

in vec4 eyeNormal;
in vec3 pos;
in vec3 oldPos;
out vec4 frag;

uniform sampler2D utexture;
uniform sampler2D utexture2;
in vec2 tex;
const float PI = 3.1415926535897932384626433832795;

void main() {
    vec3 r = reflect(vec3(0.0, 0.0, 1.0), normalize(eyeNormal.xyz));
    vec3 color =  (max(0.0,dot(normalize(eyeNormal.xyz), vec3(0.0, 0.0, 1.0))))* texture(utexture, tex).rgb + pow(max(0.0, dot(r, -normalize(pos))), 140.0)* vec3(0.8, 0.8, 0.8);
    frag =  vec4(color + 0.24*texture(utexture2, 
          vec2(0.5 + asin(eyeNormal.x) / PI, 0.5 - asin(eyeNormal.y) / PI)
    ).rgb, 1.0) ;
}

