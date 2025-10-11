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
      case 'small': return 'w-20 h-6';
      case 'large': return 'w-40 h-12';
      default: return 'w-32 h-10';
    }
  };

  const getLogoFilter = () => {
    return variant === 'white' ? 'brightness(0) invert(1) contrast(100%)' : 'none';
  };

  return (
    <div className="flex items-center">
      <img
        src="/logo-key-hours.svg"
        alt="KEY HOURS"
        className={`${getLogoSize()} object-contain`}
        style={{ filter: getLogoFilter() }}
      />
    </div>
  );
};

export default Logo;
