#version 300 es

precision mediump float;

out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_translate;
uniform float u_scale;
uniform vec3 u_circles[{{ numCircles }}];
uniform float u_rotationRad;

{% include "./utils.njk.frag" %}

vec3 computeColor(int invNum) {
    return Hsv2rgb(0.0 + 0.1 * float(invNum), 1.0, 1.0);
}

bool IIS(vec2 pos, out vec4 col) {
    int invNum = 0;

    const int maxIterations = 100;
    for(int i = 0; i < maxIterations; i++) {
        bool inFund = true;
        {% for n in range(0, numCircles) %}
        if(distance(pos, u_circles[{{ n }}].xy) < u_circles[{{ n }}].z){
            pos = CircleInvert(pos, u_circles[{{ n }}]);
            inFund = false;
            invNum++;
        }
        {% endfor %}

        if(inFund) break;
    }

    col = vec4(computeColor(invNum), 1);
    return length(pos) < 1. ? true : false;
}

const float MAX_SAMPLES = 15.;
void main() {
    float ratio = u_resolution.x / u_resolution.y / 2.0;
    vec4 sum = vec4(0);
    vec4 backgroundColor = vec4(0, 0, 0, 1);
    for(float i = 0.; i < MAX_SAMPLES; i++){
        vec2 position = ((gl_FragCoord.xy + Rand2n(gl_FragCoord.xy, i)) / u_resolution.yy ) - vec2(ratio, 0.5);
        position = position * u_scale;
        mat2 r = mat2(cos((u_rotationRad)), -sin((u_rotationRad)),
                      sin((u_rotationRad)), cos((u_rotationRad)));
        position = r * position;
        position += u_translate;

        vec4 col;
        bool isRendered = IIS(position, col);
        if(isRendered) {
            sum += col;
        } else {
            sum += backgroundColor;
        }
    }

    outColor = sum / MAX_SAMPLES;
}
