import { useState, useEffect } from "react";

/**
 * A custom hook that delays updating a value until a specified timeout has elapsed.
 * Perfect for throttling API requests during rapid user typing.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the specified delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value changes before the delay finishes.
        // This is the magic part that cancels the previous pending execution!
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}