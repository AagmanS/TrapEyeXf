import { useEffect, useRef } from 'react';

interface GlobeProps {
  data?: Array<{ region: string; value: number; color: string }>;
  size?: number;
  animated?: boolean;
}

export default function Globe({ data = [], size = 400, animated = true }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    let animationId: number;
    
    // Generate static dots once to represent the globe surface
    const dots: { x: number; y: number; z: number }[] = [];
    const dotCount = 400;
    for (let i = 0; i < dotCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / dotCount);
        const theta = Math.sqrt(dotCount * Math.PI) * phi;
        dots.push({
            x: Math.cos(theta) * Math.sin(phi),
            y: Math.sin(theta) * Math.sin(phi),
            z: Math.cos(phi)
        });
    }

    const drawGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = size / 2 - 30;

      // 1. Atmosphere Glow (Outer)
      const atmosGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.2);
      atmosGlow.addColorStop(0, 'rgba(0, 200, 255, 0.15)');
      atmosGlow.addColorStop(0.4, 'rgba(0, 100, 200, 0.05)');
      atmosGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = atmosGlow;
      ctx.fill();

      // 2. Interior Shadow (Depth)
      const innerShadow = ctx.createRadialGradient(centerX - radius/3, centerY - radius/3, 0, centerX, centerY, radius);
      innerShadow.addColorStop(0, 'rgba(10, 20, 40, 0)');
      innerShadow.addColorStop(1, 'rgba(0, 10, 30, 0.4)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = innerShadow;
      ctx.fill();

      // 3. Draw Globe Surface Dots
      dots.forEach(dot => {
          // Rotate around Y axis
          const rotAngle = rotation * (Math.PI / 180);
          const x = dot.x * Math.cos(rotAngle) - dot.z * Math.sin(rotAngle);
          const z = dot.x * Math.sin(rotAngle) + dot.z * Math.cos(rotAngle);
          const y = dot.y;

          if (z > -0.2) { // Show most dots for depth, but faint ones in back
              const scale = 1 + z * 0.3; // Perspective
              const screenX = centerX + x * radius;
              const screenY = centerY + y * radius;
              
              const opacity = (z + 0.5) / 1.5;
              ctx.fillStyle = `rgba(0, 200, 255, ${opacity * 0.3})`;
              ctx.beginPath();
              ctx.arc(screenX, screenY, Math.max(0.5, 1 * scale), 0, Math.PI * 2);
              ctx.fill();
          }
      });

      // 4. Draw Data Points (Threats)
      if (data.length > 0) {
        data.forEach((point, index) => {
          // Fixed positions based on index for stability
          const phi = (index / data.length) * Math.PI;
          const theta = (index * 2.5) + (rotation * 0.015);
          
          const x = Math.sin(phi) * Math.cos(theta);
          const y = Math.cos(phi);
          const z = Math.sin(phi) * Math.sin(theta);

          if (z > 0) {
            const screenX = centerX + x * radius;
            const screenY = centerY + y * radius;
            const scale = 1 + z * 0.5;
            
            // Pulse Effect
            const pulse = animated ? Math.sin(Date.now() / 300 + index) * 0.5 + 0.5 : 0.5;
            const glowSize = 10 + pulse * 15;

            // Outer pulse ring
            ctx.strokeStyle = point.color + (Math.floor(pulse * 100).toString(16).padStart(2, '0'));
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(screenX, screenY, glowSize * scale, 0, Math.PI * 2);
            ctx.stroke();

            // Point Glow
            const pointGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 6 * scale);
            pointGradient.addColorStop(0, point.color);
            pointGradient.addColorStop(1, point.color + '00');
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, 6 * scale, 0, Math.PI * 2);
            ctx.fillStyle = pointGradient;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(screenX, screenY, 2 * scale, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            // Region label with scanning line
            if (animated) {
                ctx.font = '700 10px JetBrains Mono, monospace';
                ctx.fillStyle = point.color;
                ctx.textAlign = 'left';
                ctx.fillText(`THREAT: ${point.region.toUpperCase()}`, screenX + 10, screenY - 5);
                
                ctx.strokeStyle = point.color + '44';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(screenX, screenY);
                ctx.lineTo(screenX + 8, screenY - 8);
                ctx.lineTo(screenX + 25, screenY - 8);
                ctx.stroke();
            }
          }
        });
      }

      // 5. Compass/UI Ring
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
      ctx.stroke();
      
      // Scanning sweep
      const sweepAngle = (rotation * 2) * (Math.PI / 180);
      const sweepGradient = ctx.createConicGradient(sweepAngle, centerX, centerY);
      sweepGradient.addColorStop(0, 'rgba(0, 200, 255, 0.1)');
      sweepGradient.addColorStop(0.1, 'rgba(0, 200, 255, 0)');
      sweepGradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
      
      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2);
      ctx.fill();

      if (animated) {
        rotation += 0.4;
        animationId = requestAnimationFrame(drawGlobe);
      }
    };

    drawGlobe();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [data, size, animated]);

  return (
    <div className="globe-container" style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 20px rgba(0, 200, 255, 0.1))' }}
      />
    </div>
  );
}
