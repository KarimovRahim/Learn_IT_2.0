'use client';

import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.2, uTime * 0.5)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor, auroraAlpha);
}
`;

const Aurora = ({
  colorStops = ['#ffb3b3', '#ff8080', '#ff4d4d'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
  time = 0,
  className = '',
  style = {}
}) => {
  const ctnDom = useRef(null);
  const canvasRef = useRef(null);
  const [isSupported, setIsSupported] = useState(true);
  const propsRef = useRef({ colorStops, amplitude, blend, speed, time });
  
  // 🔥 ФИКС: Сохраняем начальное время в sessionStorage
  const [initialTime] = useState(() => {
    // Пытаемся получить сохранённое время из sessionStorage
    const savedTime = sessionStorage.getItem('aurora-start-time');
    if (savedTime) {
      return parseFloat(savedTime);
    }
    // Если нет сохранённого времени, создаём новое и сохраняем
    const newTime = Date.now() / 1000; // в секундах
    sessionStorage.setItem('aurora-start-time', newTime.toString());
    return newTime;
  });

  useEffect(() => {
    propsRef.current = { colorStops, amplitude, blend, speed, time };
  }, [colorStops, amplitude, blend, speed, time]);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    // Проверка поддержки WebGL
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          setIsSupported(false);
          return false;
        }
        return true;
      } catch (e) {
        setIsSupported(false);
        return false;
      }
    };

    if (!checkWebGLSupport()) {
      return;
    }

    let renderer, gl, program, mesh, animateId;

    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });

      gl = renderer.gl;
      if (!gl) {
        setIsSupported(false);
        return;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.top = '0';
      gl.canvas.style.left = '0';
      gl.canvas.style.pointerEvents = 'none';

      function resize() {
        if (!ctn || !renderer || !program) return;
        const width = ctn.offsetWidth;
        const height = ctn.offsetHeight;
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width, height];
      }

      window.addEventListener('resize', resize);

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }

      const colorStopsArray = colorStops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [ctn.offsetWidth || 300, ctn.offsetHeight || 300] },
          uBlend: { value: blend }
        }
      });

      mesh = new Mesh(gl, { geometry, program });

      if (canvasRef.current) {
        try {
          if (canvasRef.current.parentNode === ctn) {
            ctn.removeChild(canvasRef.current);
          }
        } catch (e) { }
      }

      ctn.appendChild(gl.canvas);
      canvasRef.current = gl.canvas;

      // 🔥 ФИКС: Используем сохранённое начальное время
      const update = () => {
        if (!program || !renderer || !mesh) return;
        animateId = requestAnimationFrame(update);

        const currentProps = propsRef.current;
        
        // 🔥 Вычисляем время относительно сохранённого initialTime
        const currentTime = Date.now() / 1000;
        const elapsed = currentTime - initialTime;
        
        // Устанавливаем uTime на основе elapsed времени
        program.uniforms.uTime.value = (currentProps.time + elapsed) * currentProps.speed * 0.2;
        program.uniforms.uAmplitude.value = currentProps.amplitude;
        program.uniforms.uBlend.value = currentProps.blend;

        const stops = currentProps.colorStops;
        program.uniforms.uColorStops.value = stops.map(hex => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });

        try {
          renderer.render({ scene: mesh });
        } catch (e) {
          console.error('Render error:', e);
        }
      };

      animateId = requestAnimationFrame(update);
      setTimeout(resize, 100);

      return () => {
        cancelAnimationFrame(animateId);
        window.removeEventListener('resize', resize);
        try {
          if (ctn && gl?.canvas?.parentNode === ctn) {
            ctn.removeChild(gl.canvas);
          }
          if (gl) {
            gl.getExtension('WEBGL_lose_context')?.loseContext();
          }
        } catch (e) { }
      };
    } catch (error) {
      console.error('WebGL initialization error:', error);
      setIsSupported(false);
      return;
    }
  }, [initialTime]); // Добавляем initialTime в зависимости

  if (!isSupported) {
    const gradientColors = colorStops.join(', ');
    return (
      <div
        ref={ctnDom}
        className={`w-full h-full absolute inset-0 pointer-events-none ${className}`}
        style={{
          ...style,
          background: `linear-gradient(45deg, ${gradientColors})`,
          opacity: 0.3,
          zIndex: 0
        }}
      />
    );
  }

  return (
    <div
      ref={ctnDom}
      className={`w-full h-full absolute inset-0 pointer-events-none ${className}`}
      style={{
        ...style,
        background: 'transparent',
        zIndex: 0
      }}
    />
  );
};

export default Aurora;