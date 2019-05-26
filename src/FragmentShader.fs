#version 300 es

precision highp float;

in vec4 eyeNormal;
in vec3 pos;
in vec3 oldPos;
out vec4 frag;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


void main() {
    vec3 r = dot(normalize(eyeNormal.xyz), vec3(0.0, 0.0, 1.0))*2.0*normalize(eyeNormal.xyz) -vec3(0.0, 0.0, 1.0);
    vec3 color =  max(0.0,dot(normalize(eyeNormal.xyz), vec3(0.0, 0.0, 1.0)))* vec3(0.9, 0.4, 0.2) *noise(oldPos.yz*19.0+ vec2(oldPos.x)*18.0)
    +vec3(0.03, 0.3, 0.2) + pow(max(0.0, dot(r, -normalize(pos))), 3.0)* vec3(0.8, 0.5, 0.7)*0.9;
    frag = vec4(color, 1.0);
}

