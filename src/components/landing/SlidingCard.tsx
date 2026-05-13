'use client';
import React from 'react';
import UnifiedCard from '../UnifiedCard';

interface SlidingCardProps {
  title: string;
  subtitle: string;
  text: string;
  description?: string;
  button: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  content?: React.ReactNode;
  backgroundColor?: string;
}

const SlidingCard: React.FC<SlidingCardProps> = ({ 
  title, 
  subtitle, 
  text, 
  description,
  button, 
  content, 
  className = '',
  style,
  backgroundColor
}) => {
  return (
    <UnifiedCard
      title={title}
      subtitle={subtitle}
      text={text}
      description={description}
      button={button}
      content={content}
      className={className}
      style={style}
      backgroundColor={backgroundColor}
      variant="sliding"
    />
  );
};

export default SlidingCard;
