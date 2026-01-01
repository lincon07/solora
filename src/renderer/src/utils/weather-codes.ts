export const WEATHER_CODES: Record<number, {
  label: string
  icon: string
}> = {
  0:  { label: "Clear sky", icon: "sun" },

  1:  { label: "Mainly clear", icon: "sun-cloud" },
  2:  { label: "Partly cloudy", icon: "cloud-sun" },
  3:  { label: "Overcast", icon: "cloud" },

  45: { label: "Fog", icon: "fog" },
  48: { label: "Depositing rime fog", icon: "fog" },

  51: { label: "Light drizzle", icon: "drizzle" },
  53: { label: "Moderate drizzle", icon: "drizzle" },
  55: { label: "Dense drizzle", icon: "drizzle-heavy" },

  56: { label: "Light freezing drizzle", icon: "sleet" },
  57: { label: "Dense freezing drizzle", icon: "sleet" },

  61: { label: "Slight rain", icon: "rain" },
  63: { label: "Moderate rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "rain-heavy" },

  66: { label: "Light freezing rain", icon: "sleet" },
  67: { label: "Heavy freezing rain", icon: "sleet-heavy" },

  71: { label: "Slight snow fall", icon: "snow" },
  73: { label: "Moderate snow fall", icon: "snow" },
  75: { label: "Heavy snow fall", icon: "snow-heavy" },

  77: { label: "Snow grains", icon: "snow" },

  80: { label: "Slight rain showers", icon: "rain" },
  81: { label: "Moderate rain showers", icon: "rain" },
  82: { label: "Violent rain showers", icon: "rain-heavy" },

  85: { label: "Slight snow showers", icon: "snow" },
  86: { label: "Heavy snow showers", icon: "snow-heavy" },

  95: { label: "Thunderstorm", icon: "storm" },
  96: { label: "Thunderstorm with slight hail", icon: "storm-hail" },
  99: { label: "Thunderstorm with heavy hail", icon: "storm-hail" },
}
