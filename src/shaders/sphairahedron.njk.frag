struct Plane {
    vec3 normal;
    vec3 origin;
};

struct Sphairahedron {
    vec2 zbzc;
    {% if numPrismSpheres > 0 %}
    vec4 prismSpheres[{{ numPrismSpheres }}];
    {% endif %}
    {% if numPrismPlanes > 0 %}
    Plane prismPlanes[{{ numPrismPlanes }}];
    {% endif %}
    {% if numDividePlanes > 0 %}
    Plane dividePlanes[{{ numDividePlanes }}];
    {% endif %}
    float boundingPlaneY;

    {% if numFiniteSpheres > 0 %}
    vec4 finiteSpheres[{{ numFiniteSpheres }}];
    {% endif %}
    {% if numConvexSpheres > 0 %}
    vec4 convexSpheres[{{ numConvexSpheres }}];
    {% endif %}

    vec4 boundingSphere;

    int maxIterations;
    float fudgeFactor;
};

uniform Sphairahedron u_sphairahedron;

void SphereInvert(const vec4 sphere, inout vec3 pos, inout float dr) {
    vec3 diff = pos - sphere.rgb;
    float lenSq = dot(diff, diff);
    float k = (sphere.w * sphere.w) / lenSq;
    dr *= k; // (r * r) / lenSq
    pos = (diff * k) + sphere.rgb;
}

vec4 DistUnion(vec4 t1, vec4 t2) {
    return (t1.x < t2.x) ? t1 : t2;
}

vec4 DistSubtract(vec4 t1, vec4 t2) {
    return (t1.x > t2.x) ? t1 : t2;
}

float DistSphere(const vec4 sphere, const vec3 pos) {
    return distance(sphere.xyz, pos) - sphere.w;
}

float DistPlane(const Plane plane, const vec3 pos) {
    return dot(pos - plane.origin, plane.normal);
}

{% if numConvexSpheres > 0 and  numFiniteSpheres > 0 %}
float DistFiniteSphairahedron(const Sphairahedron sphairahedron, const vec3 pos) {
    float d = 999999999.;
    {% for n in range(0, numConvexSpheres) %}
    d = min(d, DistSphere(sphairahedron.convexSpheres[{{ n }}], pos));
    {% endfor %}

    {% for n in range(0, numFiniteSpheres) %}
    d = max(-DistSphere(sphairahedron.finiteSpheres[{{ n }}], pos),
            d);
    {% endfor %}
    return d;
}
{% endif %}

{% if numPrismPlanes > 0 %}
float DistPrism(const Plane prismPlanes[{{ numPrismPlanes }}], const vec3 pos) {
    float d = -1.;
    {% for n in range(0, numPrismPlanes) %}
    d = max(DistPlane(prismPlanes[{{ n }}], pos),
            d);
    {% endfor %}
    return d;
}
{% endif %}

{% if numDividePlanes > 0 and numPrismSpheres > 0 %}
float DistInfiniteSphairahedron(const Sphairahedron sphairahedron, const vec3 pos) {
    float d = DistPrism(sphairahedron.prismPlanes, pos);

    {% for n in range(0, numDividePlanes) %}
    d = max(DistPlane(sphairahedron.dividePlanes[{{ n }}], pos),
            d);
    {% endfor %}

    {% for n in range(0, numPrismSpheres) %}
    d = max(-DistSphere(sphairahedron.prismSpheres[{{ n }}], pos),
            d);
    {% endfor %}

    return d;
}
{% endif %}

{% if numFiniteSpheres > 0 %}
float DistTiledFiniteSphairahedra(const Sphairahedron sphairahedron, vec3 pos, out float invNum) {
    float dr = 1.;
    invNum = 0.;
    for(int i = 0; i < sphairahedron.maxIterations; i++) {
        {% for n in range(0, numFiniteSpheres) %}
        if(distance(pos, sphairahedron.finiteSpheres[{{ n }}].xyz) < sphairahedron.finiteSpheres[{{ n }}].w) {
            invNum++;
            SphereInvert(sphairahedron.finiteSpheres[{{ n }}], pos, dr);
            continue;
        }
        {% endfor %}
        break;
    }

    return DistFiniteSphairahedron(sphairahedron, pos) / abs(dr) * sphairahedron.fudgeFactor;
}
{% endif %}

{% if numPrismSpheres > 0 and numPrismPlanes > 0 %}
float DistTiledInfiniteSphairahedra(const Sphairahedron sphairahedron, vec3 pos, out float invNum) {
    float dr = 1.;
    invNum = 0.;
    float d;
    for(int i = 0; i < sphairahedron.maxIterations; i++) {
        bool inFund = true;

        {% for n in range(0, numPrismSpheres) %}
        if(distance(pos, sphairahedron.prismSpheres[{{ n }}].xyz) < sphairahedron.prismSpheres[{{ n }}].w) {
            invNum++;
            SphereInvert(sphairahedron.prismSpheres[{{ n }}], pos, dr);
            continue;
        }
        {% endfor %}

        {% for n in range(0, numPrismPlanes) %}
        pos -= sphairahedron.prismPlanes[{{ n }}].origin;
        d = dot(pos, sphairahedron.prismPlanes[{{ n }}].normal);
        if(d > 0.) {
            inFund = false;
            invNum ++;
            pos -= 2. * d * sphairahedron.prismPlanes[{{ n }}].normal;
        }
        pos += sphairahedron.prismPlanes[{{ n }}].origin;
        {% endfor %}

        if(inFund) break;
    }
    return DistInfiniteSphairahedron(sphairahedron, pos) / abs(dr) * sphairahedron.fudgeFactor;
}
{% endif %}
