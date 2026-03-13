import { useState, useEffect, useRef } from 'react';
import './RealisticStarCursor.css';

export default function RealisticStarCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newX = e.clientX;
      const newY = e.clientY;
      
      // Calculate velocity for subtle lag effect
      const vx = (newX - lastPosRef.current.x) * 0.3;
      const vy = (newY - lastPosRef.current.y) * 0.3;
      
      cursorRef.current = { x: newX, y: newY };
      lastPosRef.current = { x: newX, y: newY };
      
      if (!isVisible) setIsVisible(true);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: cursorRef.current.x, y: cursorRef.current.y });
        setVelocity({ x: vx, y: vy });
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

  return (
    <>
      {/* Main Realistic Star */}
      <div 
        className="realistic-star-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        {/* Core star with realistic design */}
        <div className="star-core" style={{ 
          transform: `translate(-50%, -50%) scale(${1 + speed * 0.05})` 
        }}>
          {/* Center bright point */}
          <div className="star-center"></div>
          
          {/* Star rays */}
          <div className="star-rays">
            <div className="ray ray-1"></div>
            <div className="ray ray-2"></div>
            <div className="ray ray-3"></div>
            <div className="ray ray-4"></div>
          </div>
          
          {/* Outer glow layers */}
          <div className="star-glow-1"></div>
          <div className="star-glow-2"></div>
          <div className="star-glow-3"></div>
        </div>
        
      </div>
    </>
  );
}