#version 300 es

precision highp float;

in vec3 vertex;
in vec3 vcolor;
in vec2 texcoord;

out vec2 tex;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 eyeNormal;
out vec3 pos;
out vec3 oldPos;


void main() {
    vec4 eyeSpaceVertex = modelViewMatrix * vec4(vertex, 1.0);
    vec4 normal = vec4(vcolor, 0.0);
    eyeNormal = transpose(inverse(modelViewMatrix)) * normal;
   
    gl_Position = projectionMatrix * eyeSpaceVertex;
    oldPos = vertex.xyz;
     pos = (projectionMatrix * eyeSpaceVertex).xyz;
         tex = texcoord;
}
