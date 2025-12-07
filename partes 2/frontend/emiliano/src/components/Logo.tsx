import React from 'react';
import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'white';
}

const LogoMark: React.FC<{ className?: string; fill?: string }> = ({ className = '', fill = '#000' }) => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8 L20 16 L32 24 L44 16 L32 8 Z M20 24 L8 32 L20 40 L32 32 L20 24 Z M44 24 L32 32 L44 40 L56 32 L44 24 Z M20 40 L8 48 L20 56 L32 48 L20 40 Z M44 40 L32 48 L44 56 L56 48 L44 40 Z" fill={fill}/>
  </svg>
);

const Logo: React.FC<LogoProps> = ({ size = 'medium', variant = 'default' }) => {
  const getLogoSize = () => {
    switch (size) {
      case 'small': return { icon: 'w-6 h-6', text: 'text-lg' };
      case 'large': return { icon: 'w-12 h-12', text: 'text-3xl' };
      default: return { icon: 'w-8 h-8', text: 'text-xl' };
    }
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-black';
  const iconFill = variant === 'white' ? '#ffffff' : '#000000';
  const sizes = getLogoSize();

  // Si la variante es white, usar SVG/texto en lugar de imagen
  if (variant === 'white') {
    return (
      <div className="flex items-center gap-2" style={{ background: 'transparent' }}>
        <div className={sizes.icon}>
          <LogoMark fill={iconFill} className="w-full h-full" />
        </div>
        <div className="flex flex-col">
          <span className={`${sizes.text} font-extrabold ${textColor} leading-none`}>key</span>
          <span className={`text-[10px] font-medium ${textColor} uppercase leading-tight opacity-80`}>
            Instituto Kriete de<br />Ingeniería y Ciencias
          </span>
        </div>
      </div>
    );
  }

  // Para variante default, intentar usar la imagen
  return (
    <div className="flex items-center" style={{ background: 'transparent' }}>
      <img
        src="/logo-key-hours.jpg"
        alt="KEY HOURS"
        className="w-32 h-10 object-contain"
        style={{ 
          backgroundColor: 'transparent',
        }}
        onError={(e) => {
          // Fallback: si la imagen no carga, usar SVG/texto
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="flex items-center gap-2">
                <div class="w-8 h-8">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 8 L20 16 L32 24 L44 16 L32 8 Z M20 24 L8 32 L20 40 L32 32 L20 24 Z M44 24 L32 32 L44 40 L56 32 L44 24 Z M20 40 L8 48 L20 56 L32 48 L20 40 Z M44 40 L32 48 L44 56 L56 48 L44 40 Z" fill="#000"/>
                  </svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-xl font-extrabold text-black leading-none">key</span>
                  <span class="text-[10px] font-medium text-black uppercase leading-tight opacity-80">
                    Instituto Kriete de<br />Ingeniería y Ciencias
                  </span>
                </div>
              </div>
            `;
          }
        }}
      />
    </div>
  );
};

export default Logo;
