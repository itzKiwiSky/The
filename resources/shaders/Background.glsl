uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec2 u_speed;
uniform float u_angle;
uniform float u_scale;
uniform float u_aspect;

#define PI 3.14159265359
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex)
{
    float angle = u_angle * PI / 180.0;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 size = vec2(u_scale);
    vec2 p = (pos + vec2(u_time) * u_speed) * vec2(u_aspect, 1.0);
    p = p * rot;
    float total = floor(p.x * size.x) + floor(p.y * size.y);
    bool isEven = mod(total, 2.0) == 0.0;
    vec4 col1 = vec4(u_color1 / 255.0, 1.0);
    vec4 col2 = vec4(u_color2 / 255.0, 1.0);
    return (isEven) ? col1 : col2;
}