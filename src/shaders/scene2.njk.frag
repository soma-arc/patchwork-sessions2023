#version 300 es

precision mediump float;

out vec4 outColor;

{% include "./utils.njk.frag" %}
{% include "./raytrace.njk.frag" %}
{% include "./sphairahedron.njk.frag" %}

uniform Camera u_camera;
uniform vec2 u_resolution;

const int OBJ_ID_SPHAIRAHEDRON = 0;

float g_invNum;
vec4 distFunc(vec3 pos) {
    // hit = vec4(distance, obj id, undefined, undefined)
    vec4 hit = vec4(MAX_FLOAT, -1, -1, -1);
    vec4 d = DistUnion(vec4(DistTiledFiniteSphairahedra(u_sphairahedron, pos, g_invNum),
                            OBJ_ID_SPHAIRAHEDRON, -1, -1),
                       hit);
    return d;
}

const vec2 NORMAL_COEFF = vec2(0.001, 0.);
vec3 computeNormal(const vec3 p) {
    return normalize(vec3(distFunc(p + NORMAL_COEFF.xyy).x - distFunc(p - NORMAL_COEFF.xyy).x,
                          distFunc(p + NORMAL_COEFF.yxy).x - distFunc(p - NORMAL_COEFF.yxy).x,
                          distFunc(p + NORMAL_COEFF.yyx).x - distFunc(p - NORMAL_COEFF.yyx).x));
}

const int MAX_MARCHING_LOOP = 5000;
const float MARCHING_THRESHOLD = 0.00001;
void march(const vec3 rayOrg, const vec3 rayDir,
           const float tmin, const float tmax,
           inout IsectInfo isectInfo) {
    float rayLength = tmin;
    vec3 rayPos = rayOrg + rayDir * rayLength;
    vec4 dist = vec4(-1);
    for(int i = 0 ; i < MAX_MARCHING_LOOP ; i++) {
        if(rayLength > tmax) break;
        dist = distFunc(rayPos);
        rayLength += dist.x;
        rayPos = rayOrg + rayDir * rayLength;
        if(dist.x < MARCHING_THRESHOLD) {
            isectInfo.objId = int(dist.y);

            if(isectInfo.objId == OBJ_ID_SPHAIRAHEDRON) {
                isectInfo.matColor = Hsv2rgb((1., -0.13 + (g_invNum) * 0.01), 1., 1.);
            }
            isectInfo.intersection = rayPos;
            isectInfo.normal = computeNormal(rayPos);
            isectInfo.mint = rayLength;
            isectInfo.hit = true;
            break;
        }
    }
}


// +y → -y
const vec3 LIGHT_DIR = vec3(0, -1, 0);

vec4 computeColor(const vec3 rayOrigin, const vec3 rayDir) {
    IsectInfo isectInfo = NewIsectInfo();

    vec3 l = vec3(0);
    vec3 rayPos = rayOrigin;

    march(rayPos, rayDir, 0., 1000., isectInfo);

    if(isectInfo.hit) {
        const vec3 ambientFactor = vec3(0.3);
        vec3 ambient = isectInfo.matColor * ambientFactor;
        vec3 c = vec3(0);
        float k = 1.;
        vec3 diffuse = clamp(dot(isectInfo.normal, -LIGHT_DIR), 0., 1.) * isectInfo.matColor;
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
