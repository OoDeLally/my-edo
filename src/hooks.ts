import {
  useState, useRef, useCallback, MutableRefObject, useMemo,
  RefObject, useEffect, Dispatch, SetStateAction
} from 'react';
import shortid from 'shortid';

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
 * Extends the standard `useState` hook with an ability to modify the state without
 * triggering re-rendering of the component.
 * The hook returns an array of the following shape:
 * ```javascript
 * [value, setValue, silentlySetValue]
 * ```
 * The first two elements work exactly the same way as the ones returned from `useState` while the
 * third element is a callback that updates the state value without re-rendering the host component.
 *
 * **Warning**: The main use-case for `useSilentState` is for derived state where using plain `setState`
 * would incur unnecessary re-rendering. Using it for any other purpose usually signalizes wrong flow
 * in your application state and will most likely cause weird side-effects since it can make de-synchronize
 * the application and UI states.
 *
 * **Note:** When you're reading this, you probably just need the higher level `useDependantState` instead which
 * lets you reset the state when dependencies change while making sure that UI and app states are in sync.
 */
type ValueHolder<T> = { value: T };


export const useStateWithoutRerender = <T>(initialValue: T | (() => T)):
  [T, Dispatch<SetStateAction<T>>, Dispatch<SetStateAction<T>>] => {
  const [holder, setHolder] = useState<ValueHolder<T>>(
    typeof initialValue === 'function'
      ? () => ({ value: (initialValue as () => T)() })
      : { value: initialValue }
  );

  const latestHolderRef = useValueRef(holder);

  const setValue = useCallback(
    (valueOrUpdater: SetStateAction<T>) => {
      setHolder((prevHolder: ValueHolder<T>) => {
        const newValue =
          isFunction(valueOrUpdater)
            ? valueOrUpdater(prevHolder.value)
            : valueOrUpdater;
        const newHolder =
          prevHolder.value === newValue
            ? prevHolder
            : { value: newValue };

        latestHolderRef.current = newHolder;
        return newHolder;
      });
    },
    [setHolder, latestHolderRef],
  );

  const silentlySetValue = useCallback(
    (valueOrUpdater: SetStateAction<T>) => {
      latestHolderRef.current.value =
        isFunction(valueOrUpdater)
          ? valueOrUpdater(latestHolderRef.current.value)
          : valueOrUpdater;
    },
    [latestHolderRef],
  );

  return [holder.value, setValue, silentlySetValue];
};



const sameDeps = (array1: unknown[], array2: unknown[]) =>
  array1 === array2 ||
  (!!array1 && !!array2 && array1.length === array2.length && array1.every((value, index) => value === array2[index]));


/**
 * An extension to the `useState` hook which resets the current
 * value to the `initialValue` every time the `deps` change.
 */
export const useDependantState = <T>(initialValue: T | ((currentValue: T | undefined) => T), deps: unknown[]):
  [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue, silentlySetValue] = useStateWithoutRerender(
    isFunction(initialValue) ? () => initialValue(undefined) : initialValue
  );
  const lastDepsRef = useRef(deps);
  if (!sameDeps(deps, lastDepsRef.current)) {
    const newValue =
      isFunction(initialValue)
        ? initialValue(value)
        : initialValue;
    silentlySetValue(newValue);
    lastDepsRef.current = deps;
    return [newValue, setValue];
  } else {
    lastDepsRef.current = deps;
    return [value, setValue];
  }
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


/**
 * Generate a string key for each element of an array.
 * This is useful when you don't have any unique string value for
 * React to use when creating arrays of components.
 *
 * const MyComponent = ({ myArray }) => {
 *   const arrayKeys = useKeyMap(myArray);
 *   return myArray.map(
 *     item => <Item item={item} key={arrayKeys.get(item)} >
 *   );
 * }
 */
export const useKeyMap = <T>(array: T[]): Map<T, string> => {
  return useMemo(
    () => {
      const map = new Map();
      array.forEach(val => map.set(val, shortid.generate()));
      return map;
    },
    [array],
  );
};
