'use client';
import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'outline-only' | 'solid' | 'ghost' | 'icon' | 'cta';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  href?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  onClick,
  href,
  className = '',
  fullWidth = false,
  disabled = false,
  loading = false,
  title,
  ...props
}) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${disabled ? styles.disabled : ''} ${loading ? styles.loading : ''} ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={buttonClasses}
        title={title}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </a>
    );
  }
  
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
