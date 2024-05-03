export async function fetchWeatherData(city: string, days: number) {
  const apiUrl = process.env.NEXT_PUBLIC_FORECAST_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const url = `${apiUrl}?key=${apiKey}&q=${city}&days=${days}&aqi=yes&alerts=yes`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export async function fetchHistoryData(city: string, year: number) {
  const apiUrl = process.env.NEXT_PUBLIC_HISTORY_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const url = `${apiUrl}?key=${apiKey}&q=${city}&dt=${year}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch history data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
}
