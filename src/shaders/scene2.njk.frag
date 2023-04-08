#version 300 es

precision mediump float;

out vec4 outColor;

{% include "./raytrace.njk.frag" %}
{% include "./sphairahedron.njk.frag" %}

uniform Camera u_camera;
uniform vec2 u_resolution;

const int OBJ_ID_SPHERE = 0;

// +y → -y
const vec3 LIGHT_DIR = vec3(0, -1, 0);

vec4 computeColor(const vec3 rayOrigin, const vec3 rayDir) {
    IsectInfo isectInfo = NewIsectInfo();

    vec3 l = vec3(0);
    vec3 rayPos = rayOrigin;

    IntersectSphere(OBJ_ID_SPHERE, vec3(1, 0, 0), vec4(0, 0, 0, 1),
                    rayPos, rayDir, isectInfo);

    if(isectInfo.hit) {
        const vec3 ambientFactor = vec3(0.3);
        vec3 ambient = isectInfo.matColor * ambientFactor;
        vec3 c = vec3(0);
        float k = 1.;
        vec3 diffuse =  clamp(dot(isectInfo.normal, -LIGHT_DIR), 0., 1.) * isectInfo.matColor;
        l += k * diffuse + ambient;
    }

    return vec4(l, 1.);
}

void main() {
    vec2 coordOffset = vec2(0.5, 0.5);
    vec3 ray = CalcRay(u_camera.pos, u_camera.target, u_camera.up, u_camera.fovRad,
                       u_resolution, gl_FragCoord.xy + coordOffset);
    vec3 org = u_camera.pos;

    vec4 col = computeColor(org, ray);
    
    outColor = col;
}
