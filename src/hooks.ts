import { useState, useRef, useCallback, MutableRefObject, useMemo, RefObject, useEffect } from 'react';

/**
 * Provide a state that triggers a re-render depending on which dependency is used.
 * `stateValue` and `valueRef.current` provide the same value.
 * However a dependency on `valueRef` will not trigger a re-render when the value changes.
 */
export const useStateAndRef = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);
  const setValueAndRef = useCallback(
    (newValue: T) => {
      setValue(newValue);
      ref.current = newValue;
    },
    [setValue, ref],
  );
  return [value, ref, setValueAndRef] as const;
};


/**
 * Like a classic userRef, but with a handful setCurrent function.
 */
export const useRefWithSetter = <T>(initialValue: T) => {
  const ref = useRef<T>(initialValue);
  const setCurrent = useCallback(
    (newValue: T) => {
      ref.current = newValue;
    },
    [ref],
  );
  return [ref, setCurrent] as const;
};


/**
 * Caches previous `value` for usages when current `value` is not available.
 * Availability of `value` is by default determined using `value != null`.
 * If more specific control is required, the second argument is here to the rescue.
 * Passing truthy value to `isAvailable` marks the provided `value` as available,
 * while falsy will make the function return the cached one.
 */
export const useLastAvailable = <T>(value: T, isAvailable: boolean = value != null): T => {
  const lastDataRef = useRef(value);
  if (isAvailable) {
    lastDataRef.current = value;
    return value;
  } else {
    return lastDataRef.current;
  }
};


/**
 * Constantly update the value without changing the ref.
 */
export const useValueRef = <T>(currentValue: T): MutableRefObject<T> => {
  const ref = useRef<T>(currentValue);
  ref.current = currentValue;
  return ref;
};


// tslint:disable-next-line: ban-types
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};


/**
 * Memoize an object, and only create a new object if one of its immediate keys or values changed.
 * The order of keys is irrelevant.
 */
export const useShallowMemoizedObject = <T extends object>(object: T): T =>
  useMemo(
    () => object,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.keys(object).sort().map(key => [key, (object as Record<string, unknown>)[key]]).flat(),
  );



/**
 * Easy togglable boolean state.
 */
export const useTogglableState = (initialState: boolean): [boolean, () => void] => {
  const [isOn, setIsOn] = useState(initialState);
  const toggle = useCallback(
    () => setIsOn(prevState => !prevState),
    [setIsOn],
  );
  return [isOn, toggle];
};


/**
 * Tell whether a component is still mounted.
 * Use it after a long asynchronous operation, in order to check if your target component
 * still exists when the operation completes.
 * Adapted from https://github.com/jmlweb/isMounted.
 */
export const useIsComponentMounted = (): RefObject<boolean> => {
  const isMountedRef = useRef(false);
  useEffect(
    () => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    },
    [],
  );
  return isMountedRef;
};


