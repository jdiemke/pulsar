#version 300 es

precision highp float;

out vec4 outColor;

const float PI = 3.14159265;
const float iTime = 1.0;
uniform float myTime;
void main() {
    float time = myTime;

    float color1, color2, color;
	
	color1 = (sin(dot(gl_FragCoord.xy,vec2(sin(time*3.0),cos(time*3.0)))*0.02+time*3.0)+1.0)/2.0;
	
	vec2 center = vec2(640.0/2.0, 360.0/2.0) + vec2(640.0/2.0*sin(-time*3.0),360.0/2.0*cos(-time*3.0));
	
	color2 = (cos(length(gl_FragCoord.xy - center)*0.03)+1.0)/2.0;
	
	color = (color1+ color2)/2.0;

	float red	= (cos(PI*color/0.5+time*3.0)+1.0)/2.0;
	float green	= (sin(PI*color/0.5+time*3.0)+1.0)/2.0;
	float blue	= (sin(+time*3.0)+1.0)/2.0;
	
    outColor = vec4(red, green, blue, 1.0);
}
