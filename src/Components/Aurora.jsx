'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

// Глобальный счётчик активных WebGL контекстов
let activeWebGLContexts = 0;
const MAX_WEBGL_CONTEXTS = 12;

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
  const [isActive, setIsActive] = useState(true);
  const propsRef = useRef({ colorStops, amplitude, blend, speed, time });
  const contextCreatedRef = useRef(false);
  const animationRef = useRef(null);
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const glRef = useRef(null);
  const mountedRef = useRef(true);

  // Сохраняем начальное время в sessionStorage
  const [initialTime] = useState(() => {
    const savedTime = sessionStorage.getItem('aurora-start-time');
    if (savedTime) {
      return parseFloat(savedTime);
    }
    const newTime = Date.now() / 1000;
    sessionStorage.setItem('aurora-start-time', newTime.toString());
    return newTime;
  });

  useEffect(() => {
    propsRef.current = { colorStops, amplitude, blend, speed, time };
  }, [colorStops, amplitude, blend, speed, time]);

  // Функция очистки WebGL контекста
  const cleanupWebGL = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    try {
      if (rendererRef.current && glRef.current && glRef.current.canvas && glRef.current.canvas.parentNode === ctnDom.current) {
        ctnDom.current?.removeChild(glRef.current.canvas);
      }
      
      if (glRef.current) {
        const loseContext = glRef.current.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    } catch (e) {
      // Игнорируем ошибки очистки
    }

    rendererRef.current = null;
    programRef.current = null;
    meshRef.current = null;
    glRef.current = null;
    canvasRef.current = null;
  }, []);

  // Функция инициализации WebGL
  const initWebGL = useCallback(() => {
    if (!mountedRef.current || !ctnDom.current) return false;
    
    // Проверка лимита WebGL контекстов
    if (activeWebGLContexts >= MAX_WEBGL_CONTEXTS) {
      setIsSupported(false);
      return false;
    }

    try {
      const renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });

      const gl = renderer.gl;
      if (!gl) {
        setIsSupported(false);
        return false;
      }

      activeWebGLContexts++;
      contextCreatedRef.current = true;
      rendererRef.current = renderer;
      glRef.current = gl;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.top = '0';
      gl.canvas.style.left = '0';
      gl.canvas.style.pointerEvents = 'none';

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }

      const colorStopsArray = propsRef.current.colorStops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: propsRef.current.amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [ctnDom.current.offsetWidth || 300, ctnDom.current.offsetHeight || 300] },
          uBlend: { value: propsRef.current.blend }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      if (canvasRef.current?.parentNode === ctnDom.current) {
        ctnDom.current?.removeChild(canvasRef.current);
      }

      ctnDom.current.appendChild(gl.canvas);
      canvasRef.current = gl.canvas;
      programRef.current = program;
      meshRef.current = mesh;

      return true;
    } catch (error) {
      console.error('Aurora init error:', error);
      setIsSupported(false);
      return false;
    }
  }, []);

  // Функция анимации
  const animate = useCallback(() => {
    if (!mountedRef.current) return;
    if (!programRef.current || !rendererRef.current || !meshRef.current || !glRef.current) {
      // Если контекст потерян, переинициализируем
      if (isActive && mountedRef.current) {
        cleanupWebGL();
        setTimeout(() => {
          if (mountedRef.current && isActive) {
            initWebGL();
          }
        }, 100);
      }
      return;
    }

    animationRef.current = requestAnimationFrame(animate);

    const currentProps = propsRef.current;
    const currentTime = Date.now() / 1000;
    const elapsed = currentTime - initialTime;
    
    try {
      programRef.current.uniforms.uTime.value = (currentProps.time + elapsed) * currentProps.speed * 0.2;
      programRef.current.uniforms.uAmplitude.value = currentProps.amplitude;
      programRef.current.uniforms.uBlend.value = currentProps.blend;

      const stops = currentProps.colorStops;
      programRef.current.uniforms.uColorStops.value = stops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });

      rendererRef.current.render({ scene: meshRef.current });
    } catch (e) {
      // Ошибка рендеринга — пробуем восстановить
      if (mountedRef.current) {
        cleanupWebGL();
        setTimeout(() => {
          if (mountedRef.current && isActive) {
            initWebGL();
          }
        }, 100);
      }
    }
  }, [initialTime, isActive, cleanupWebGL, initWebGL]);

  // Функция ресайза
  const handleResize = useCallback(() => {
    if (!mountedRef.current || !ctnDom.current || !rendererRef.current || !programRef.current) return;
    const width = ctnDom.current.offsetWidth;
    const height = ctnDom.current.offsetHeight;
    if (width === 0 || height === 0) return;
    rendererRef.current.setSize(width, height);
    programRef.current.uniforms.uResolution.value = [width, height];
    if (glRef.current) {
      glRef.current.viewport(0, 0, width, height);
    }
  }, []);

  // Слушатель потери контекста
  useEffect(() => {
    const handleContextLost = (e) => {
      e.preventDefault();
      setIsActive(false);
      cleanupWebGL();
    };

    const handleContextRestored = () => {
      setIsActive(true);
    };

    if (glRef.current) {
      glRef.current.canvas.addEventListener('webglcontextlost', handleContextLost);
      glRef.current.canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (glRef.current?.canvas) {
        glRef.current.canvas.removeEventListener('webglcontextlost', handleContextLost);
        glRef.current.canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, [cleanupWebGL]);

  // Основной эффект
  useEffect(() => {
    mountedRef.current = true;
    setIsActive(true);

    const success = initWebGL();
    if (success) {
      animate();
      handleResize();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      mountedRef.current = false;
      setIsActive(false);
      window.removeEventListener('resize', handleResize);
      cleanupWebGL();
      
      if (contextCreatedRef.current) {
        activeWebGLContexts--;
        contextCreatedRef.current = false;
      }
    };
  }, [initWebGL, animate, handleResize, cleanupWebGL]);

  // Fallback при отсутствии поддержки WebGL
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