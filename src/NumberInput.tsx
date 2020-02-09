import React, { useRef, useEffect, useCallback } from 'react';


export const NumberInput = ({ initialValue, onBlur, onChange, min, max }: NumberInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef<number>(initialValue);
  useEffect(
    () => {
      const input = inputRef.current;
      if (input) {
        input.value = String(valueRef.current);
      }
    },
    [valueRef, inputRef],
  );

  const handleBlur = useCallback(
    () => {
      if (onBlur) {
        onBlur(inputRef.current!.valueAsNumber);
      }
    },
    [onBlur, inputRef],
  );

  const handleChange = useCallback(
    () => {
      if (onChange) {
        onChange(inputRef.current!.valueAsNumber);
      }
    },
    [onChange, inputRef],
  );

  return (
    <input
      type="number"
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
}
