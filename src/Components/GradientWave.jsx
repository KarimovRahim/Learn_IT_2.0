import React, { useEffect, useRef } from "react";

const GradientWave = ({
  colors = ["#FF0000", "#FF6B6B", "#FFB6B6"],
  speed = 0.5,
  intensity = 1,
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 0.01 * speed;
      
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0, 0, w, h);
      
      for (let i = 0; i < 5; i++) {
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        
        colors.forEach((color, idx) => {
          const pos = (idx / (colors.length - 1) + time * 0.1) % 1;
          gradient.addColorStop(pos, color);
        });
        
        ctx.globalAlpha = 0.15 * intensity;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    
    window.addEventListener("resize", resize);
    
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, speed, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default GradientWave;