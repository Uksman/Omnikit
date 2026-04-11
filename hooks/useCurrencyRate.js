import { useState, useEffect } from "react";

/**
 * Hook to fetch and manage currency exchange rates.
 */
export const useCurrencyRate = (fromUnit, toUnit, isEnabled) => {
  const [rate, setRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEnabled || !fromUnit || !toUnit) return;

    const fetchRate = async () => {
      if (fromUnit === toUnit) {
        setRate(1);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?from=${fromUnit}&to=${toUnit}`
        );
        const data = await response.json();

        if (data.rates && data.rates[toUnit]) {
          setRate(data.rates[toUnit]);
        } else {
          throw new Error("Invalid rate data received");
        }
      } catch (err) {
        console.error("Currency fetch error:", err);
        setError("Could not fetch latest rates.");
        setRate(0.92); // Basic fallback rate
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [fromUnit, toUnit, isEnabled]);

  return { rate, isLoading, error };
};
