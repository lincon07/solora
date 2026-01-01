// src/utils/geocode.ts
export async function geocodePostalCode(
  postalCode: string,
  country = "US"
) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${postalCode}&country=${country}&count=1`
  )

  const data = await res.json()

  if (!data.results?.length) {
    throw new Error("Invalid postal code")
  }

  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude,
    name: data.results[0].name,
  }
}
