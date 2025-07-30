import React from 'react';
import './Input.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, size = 'md', ...props }, ref) => {
    return (
      <div className="input-container">
        {label && <label className="input-label">{label}</label>}
        <input
          className={`input input--${size} ${error ? 'input--error' : ''} ${className || ''}`}
          ref={ref}
          {...props}
        />
        {error && <div className="input-error">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
