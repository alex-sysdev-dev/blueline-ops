import React from 'react';

export default function BrandWordmark({
  className = '',
  blueClassName = 'text-blue-600 dark:text-blue-400',
  restClassName = 'text-slate-900 dark:text-white',
  uppercase = false,
}) {
  const blueText = uppercase ? 'BLUE' : 'Blue';
  const restText = uppercase ? 'LINEOPS' : 'LineOps';

  return (
    <span className={className}>
      <span className={blueClassName}>{blueText}</span>
      <span className={restClassName}>{restText}</span>
    </span>
  );
}