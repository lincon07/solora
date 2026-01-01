import { geocodePostalCode } from "@renderer/utils/geo-code";
import { WEATHER_CODES } from "@renderer/utils/weather-codes";
import { useEffect, useState } from "react";

export function useWeatherByPostalCode(
  postalCode: string,
  country = "US"
) {
  const [weather, setWeather] = useState<{
    temp: number;
    label: string;
    iconCode: number;
  } | null>(null);

  useEffect(() => {
    if (!postalCode) return;

    let timer: NodeJS.Timeout;

    async function fetchWeather() {
      const { lat, lon } = await geocodePostalCode(postalCode, country);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,weathercode` +
          `&temperature_unit=fahrenheit`
      );

      const data = await res.json();
      const code = data.current.weathercode;
      const meta = WEATHER_CODES[code];

      setWeather({
        temp: Math.round(data.current.temperature_2m),
        label: meta?.label ?? "Unknown",
        iconCode: code,
      });
    }

    fetchWeather();
    timer = setInterval(fetchWeather, 5 * 60 * 1000);

    return () => clearInterval(timer);
  }, [postalCode, country]);

  return { weather };
}
