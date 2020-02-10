import React, { useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';



export const NumberInput = ({ initialValue, onBlur, onChange, min, max, enableManualEdit, className, type }: NumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => {
      if (!(enableManualEdit === undefined || enableManualEdit)) {
        inputRef.current!.addEventListener('keypress', (e) => {
          e.preventDefault();
        });
      }
    },
    [inputRef, enableManualEdit],
  );

  useEffect(
    () => {
      inputRef.current!.value = String(initialValue);
    },
    [initialValue, inputRef],
  );

  const getValue = useCallback(
    () => {
      const value = +inputRef.current!.value;
      if (Number.isFinite(value)) {
        return value;
      } else {
        inputRef.current!.value = String(initialValue);
        return initialValue;
      }
    },
    [initialValue],
  )

  const handleBlur = useCallback(
    () => {
      if (onBlur) {
        onBlur(getValue());
      }
    },
    [onBlur, getValue],
  );

  const handleChange = useCallback(
    () => {
      if (onChange) {
        onChange(getValue());
      }
    },
    [onChange, getValue],
  );

  return (
    <input
      className={classNames('number', className)}
      type={type || 'number'}
      min={min}
      max={max}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={inputRef}
    />
  );
};


interface NumberInputProps {
  initialValue: number;
  onBlur?: (value: number) => void;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  type?: string;
  enableManualEdit?: boolean;
  className?: string;
}
