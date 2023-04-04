struct Camera {
    vec3 pos;
    vec3 target;
    float fovRad;
    vec3 up;
};

struct IsectInfo {
    int objId;
    vec3 normal;
    vec3 intersection;
    float mint;
    float maxt;
    vec3 matColor;
    bool hit;
};

const float MAX_FLOAT = 1e20;
const float THRESHOLD = 0.001;

IsectInfo NewIsectInfo() {
    IsectInfo isectInfo;
    isectInfo.objId = -1;
    isectInfo.mint = MAX_FLOAT;
    isectInfo.maxt = -MAX_FLOAT;
    isectInfo.hit = false;
    return isectInfo;
}

vec3 CalcRay (const vec3 eye, const vec3 target, const vec3 up, const float fov,
              const vec2 resolution, const vec2 coord){
    float imagePlane = (resolution.y * .5) / tan(fov * .5);
    vec3 v = normalize(target - eye);
    vec3 xaxis = normalize(cross(v, up));
    vec3 yaxis =  normalize(cross(v, xaxis));
    vec3 center = v * imagePlane;
    vec3 origin = center - (xaxis * (resolution.x  *.5)) - (yaxis * (resolution.y * .5));
    return normalize(origin + (xaxis * coord.x) + (yaxis * (resolution.y - coord.y)));
}

vec3 CalcRayOrtho (const vec3 eye, const vec3 target, const vec3 up, const float orthoWidth,
                   const vec2 resolution, const vec2 coord,
                   out vec3 rayOrigin){
    vec3 v = normalize(target - eye);
    vec3 xaxis = normalize(cross(v, up));
    vec3 yaxis =  normalize(cross(v, xaxis));
    vec2 orthoPlane = vec2(orthoWidth, orthoWidth * resolution.y / resolution.x);
    vec3 planeOrigin = eye - (xaxis * (orthoPlane.x * .5)) - (yaxis * (orthoPlane.y * .5));
    rayOrigin = planeOrigin + (xaxis * orthoPlane.x * coord.x / resolution.x) + (yaxis * orthoPlane.y * coord.y / resolution.y);
    return v;
}

vec2 Rand2n(const vec2 co, const float sampleIndex) {
    vec2 seed = co * (sampleIndex + 1.0);
    seed+=vec2(-1,1);
    // implementation based on: lumina.sourceforge.net/Tutorials/Noise.html
    return vec2(fract(sin(dot(seed.xy ,vec2(12.9898,78.233))) * 43758.5453),
                fract(cos(dot(seed.xy ,vec2(4.898,7.23))) * 23421.631));
}

void IntersectSphere(const int objId, const vec3 matColor,
                     const vec4 sphere,
                     const vec3 rayOrigin, const vec3 rayDir, inout IsectInfo isectInfo){
    vec3 v = rayOrigin - sphere.xyz;
    float b = dot(rayDir, v);
    float c = dot(v, v) - sphere.w * sphere.w;
    float d = b * b - c;
    if(d >= 0.){
        float s = sqrt(d);
        float t = -b - s;
        if(t <= THRESHOLD) t = -b + s;
        if(THRESHOLD < t && t < isectInfo.mint){
            isectInfo.objId = objId;
            isectInfo.matColor = matColor;
            isectInfo.mint = t;
            isectInfo.intersection = (rayOrigin + t * rayDir);
            isectInfo.normal = normalize(isectInfo.intersection - sphere.xyz);
            isectInfo.hit = true;
        }
    }
}

// const float DIV_PI = 1.0 / PI;
// const vec3 dielectricSpecular = vec3(0.04);

// // This G term is used in glTF-WebGL-PBR
// // Microfacet Models for Refraction through Rough Surfaces
// float G1_GGX(float alphaSq, float NoX) {
//     float tanSq = (1.0 - NoX * NoX) / max((NoX * NoX), 0.00001);
//     return 2. / (1. + sqrt(1. + alphaSq * tanSq));
// }

// // 1 / (1 + delta(l)) * 1 / (1 + delta(v))
// float Smith_G(float alphaSq, float NoL, float NoV) {
//     return G1_GGX(alphaSq, NoL) * G1_GGX(alphaSq, NoV);
// }

// // Height-Correlated Masking and Shadowing
// // Smith Joint Masking-Shadowing Function
// float GGX_Delta(float alphaSq, float NoX) {
//     return (-1. + sqrt(1. + alphaSq * (1. / (NoX * NoX) - 1.))) / 2.;
// }

// float SmithJoint_G(float alphaSq, float NoL, float NoV) {
//     return 1. / (1. + GGX_Delta(alphaSq, NoL) + GGX_Delta(alphaSq, NoV));
// }

// float GGX_D(float alphaSq, float NoH) {
//     float c = (NoH * NoH * (alphaSq - 1.) + 1.);
//     return alphaSq / (c * c)  * DIV_PI;
// }

// vec3 computeIBL(vec3 diffuseColor, vec3 specularColor,
//                 vec3 reflection, vec3 L,
//                 float NoL, float NoV) {
//     float mixFact = (exp(1. * NoL) - 1.) / (exp(1.) - 1.);
//     vec3 diffuse = diffuseColor * mix(vec3(0.2), vec3(1), mixFact);

//     vec2 brdf = textureLod(u_brdfLUT,
//                            vec2(NoV,
//                                 u_metallicRoughness.y), 0.0).rg;
//     float LoReflect = clamp(dot(L, reflection), 0.0, 1.0);
//     mixFact = (exp(2. * LoReflect) - 1.)/(exp(2.) - 1.);
//     vec3 specularLight = mix(vec3(0.1, 0.1, 0.3), vec3(1, 1, 1), mixFact);
//     vec3 specular = specularLight * (specularColor * brdf.x + brdf.y);
//     return diffuse + specular;
// }

// vec3 BRDF(vec3 baseColor, float metallic, float roughness, vec3 dielectricSpecular,
//           vec3 L, vec3 V, vec3 N) {
//     vec3 H = normalize(L+V);

//     float LoH = clamp(dot(L, H), 0.0, 1.0);
//     float NoH = clamp(dot(N, H), 0.0, 1.0);
//     float VoH = clamp(dot(V, H), 0.0, 1.0);
//     float NoL = clamp(dot(N, L), 0.0, 1.0);
//     float NoV = abs(dot(N, V));

//     vec3 F0 = mix(dielectricSpecular, baseColor, metallic);
//     vec3 cDiff = mix(baseColor * (1. - dielectricSpecular.r),
//                      BLACK,
//                      metallic);
//     float alpha = roughness * roughness;
//     float alphaSq = alpha * alpha;

//     // Schlick's approximation
//     vec3 F = F0 + (vec3(1.) - F0) * pow((1. - VoH), 5.);

//     vec3 diffuse = (vec3(1.) - F) * cDiff * DIV_PI;

//     //float G = SmithJoint_G(alphaSq, NoL, NoV);
//     float G = Smith_G(alphaSq, NoL, NoV);

//     float D = GGX_D(alphaSq, NoH);

//     vec3 specular = (F * G * D) / (4. * NoL * NoV);
//     vec3  c = clamp((diffuse + specular) * NoL, 0.0, 1.0);
//     c += computeIBL(cDiff, F0, normalize(reflect(-V, N)), L, NoL, NoV);
//     return c;
// }
