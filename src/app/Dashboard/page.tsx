"use client";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import React, { useEffect, useState } from "react";
import PolarChart from "../components/chart/polarChart";
import BarChart from "../components/chart/barChart";
import { calculateSunDuration } from "../components/calculation";
import { calculateMoonDuration } from "../components/calculation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import WeatherIcon from "../components/weatherIcon";
import { Separator } from "@/components/ui/Separator";
import {
  fetchHistoryData,
  fetchWeatherData,
} from "../../../pages/api/utils/route";

interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface AirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
}

interface Current {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  air_quality: AirQuality;
}

interface Day {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
  air_quality: AirQuality;
}

interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

interface Hour {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  snow_cm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number;
  will_it_snow: number;
  chance_of_snow: number;
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
  air_quality: AirQuality;
  short_rad: number;
  diff_rad: number;
}

interface ForecastDay {
  date: string;
  date_epoch: number;
  day: Day;
  astro: Astro;
  hour: Hour[];
}

interface Forecast {
  forecastday: ForecastDay[];
}

interface WeatherData {
  location: Location;
  current: Current;
  forecast: Forecast;
}
const Page = () => {
  const [city, setCity] = useState("Puchong");
  const [day, setDay] = useState(7);
  const [data, setData] = useState<WeatherData | null>(null);
  const [historyData, setHistoryData] = useState(null);
  const [year, setYear] = useState<number>(2024);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData(city, day);
  }, [city, day]);
  const windData = [
    { label: "km/h", value: data?.current?.wind_kph },
    { label: "mph", value: data?.current?.wind_mph },
  ];

  useEffect(() => {
    fetchHistoryDatas;
  }, [city, year]);
  console.log("history", historyData);

  const fetchHistoryDatas = async (city: string, year: number) => {
    try {
      const historyData = await fetchHistoryData(city, year);

      if (historyData) {
        setHistoryData(historyData);
        setLoading(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  const uvData = data?.forecast?.forecastday.map(
    (forecastDay: ForecastDay) => ({
      date: forecastDay.date,
      uv: forecastDay.day.uv,
    })
  );

  const fetchData = async (city: string, day: number) => {
    if (!city.trim()) {
      return;
    }
    try {
      const jsonData = await fetchWeatherData(city, day);

      if (jsonData) {
        setData(jsonData);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(true);
    }
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex space-x-5">
          <Card className="w-2/5">
            <CardHeader>
              <CardTitle>
                <Input
                  type="text"
                  id="cityInput"
                  placeholder="Search for your location"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const inputElement = e.target as HTMLInputElement; // Type assertion
                      fetchData(inputElement.value, day);
                    }
                  }}
                ></Input>
              </CardTitle>
              <CardDescription className="flex justify-center items-center pt-5">
                {error ? (
                  <Alert className="bg-red-200 text-xl">
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      The location you entered was not found. Please try again
                      with a different location.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {data && (
                      <WeatherIcon
                        code={data.current.condition.code}
                        isDay={data.current.is_day === 1 ? 1 : 0}
                        width={200}
                        height={200}
                      />
                    )}
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-lg">
              <div className="text-8xl">
                {(data && data.current?.temp_c) || 0}°c
              </div>

              <div className="">{data && data.current?.condition.text}</div>
            </CardContent>
            <Separator className="my-5" />
            <CardFooter className="">
              <div className="flex flex-col text-sm space-y-5">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/map.png"
                    alt="Weather Icon"
                    width={25} // Set the desired width
                    height={25} // Set the desired height
                  />
                  <div>
                    {data?.location?.name}, {data?.location?.country}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Image
                    src="/schedule.png"
                    alt="Weather Icon"
                    width={25} // Set the desired width
                    height={25} // Set the desired height
                  />
                  <div>{data?.location?.localtime}</div>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card className="w-4/5">
            <CardHeader>
              <CardDescription>Today's Highlight</CardDescription>
            </CardHeader>
            <CardContent className="flex items-stretch space-x-5">
              <Card className="w-1/3 hover:bg-[#f7f7f7] flex flex-col">
                <CardHeader>
                  <CardDescription className="flex items-center">
                    <Image
                      src="/wind.png"
                      alt="Weather Icon"
                      width={25} // Set the desired width
                      height={25} // Set the desired height
                    />
                    Wind Status
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <PolarChart data={windData} />
                </CardContent>
                <CardFooter>
                  <div className="text-black text-3xl">
                    {data?.current?.wind_kph}
                    <span className="text-[#A3A3A3] text-sm">km/h</span>
                  </div>
                  <div className="text-black text-3xl ml-auto">
                    {data?.current?.wind_mph}
                    <span className="text-[#A3A3A3] text-sm">m/h</span>
                  </div>
                </CardFooter>
              </Card>
              <Card className="w-1/3 hover:bg-[#f7f7f7] flex flex-col">
                <CardHeader>
                  <CardDescription className="flex items-center">
                    <Image
                      src="/uv.png"
                      alt="Weather Icon"
                      width={25} // Set the desired width
                      height={25} // Set the desired height
                    />
                    UV Index
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <BarChart data={uvData} width={175} height={175} />
                </CardContent>
                <CardFooter className="">
                  <div className="text-black text-3xl">
                    {data?.current?.uv}
                    <span className="text-sm text-[#A3A3A3]">uv </span>
                  </div>
                </CardFooter>
              </Card>
              <Card className="w-1/3 hover:bg-[#f7f7f7] flex flex-col">
                <CardHeader>
                  <CardDescription className="flex items-center">
                    <Image
                      src="/sunset.png"
                      alt="Weather Icon"
                      width={25} // Set the desired width
                      height={25} // Set the desired height
                    />
                    Sunrise & Sunset
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center space-x-5">
                  <div className="flex flex-col">
                    <div className="text-yellow-500 text-xl">Sunrise</div>
                    <div className="text-black">
                      {data?.forecast?.forecastday[0].astro.sunrise}
                    </div>
                  </div>
                  <div className="text-center flex-grow p-4 font-bold">
                    {calculateSunDuration(
                      data?.forecast?.forecastday[0].astro.sunrise!,
                      data?.forecast?.forecastday[0].astro.sunset!
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-yellow-500 text-xl">Sunset</div>
                    <div className="text-black">
                      {data?.forecast?.forecastday[0].astro.sunset}
                    </div>
                  </div>
                </CardContent>

                <CardContent className="flex justify-center space-x-5">
                  <div className="flex flex-col">
                    <div className="text-yellow-500 text-xl">Moonrise</div>
                    <div className="text-black">
                      {data?.forecast?.forecastday[0].astro.moonrise}
                    </div>
                  </div>
                  <div className="text-center flex-grow font-bold">
                    {calculateMoonDuration(
                      data?.forecast?.forecastday[0].astro.moonset!,

                      data?.forecast?.forecastday[0].astro.moonrise!
                    )}
                  </div>
                  <div className="flex flex-col ml-auto">
                    <div className="text-yellow-500 text-xl">Moonset</div>
                    <div className="text-black">
                      {data?.forecast?.forecastday[0].astro.moonset}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter className="space-x-5">
              <Card className="w-1/3 hover:bg-[#f7f7f7]">
                <CardHeader>
                  <CardDescription className="flex items-center">
                    <Image
                      src="/humidity.png"
                      alt="Weather Icon"
                      width={25} // Set the desired width
                      height={25} // Set the desired height
                    />
                    Humidity
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="text-black text-3xl ">
                    {data?.current?.humidity}
                    <span className="text-[#A3A3A3] text-sm">%</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-1/3 hover:bg-[#f7f7f7]">
                <CardHeader>
                  <CardDescription className="flex items-center">
                    <Image
                      src="/high-visibility.png"
                      alt="Weather Icon"
                      width={25} // Set the desired width
                      height={25} // Set the desired height
                    />
                    Visibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="text-black text-3xl ">
                    {data?.current?.vis_km}
                    <span className="text-[#A3A3A3] text-sm">km</span>
                  </div>
                  <div className="text-black text-3xl ml-auto">
                    {data?.current?.vis_miles}
                    <span className="text-[#A3A3A3] text-sm">miles</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-1/3 hover:bg-[#f7f7f7]">
                <CardHeader>
                  <CardDescription className="flex items-center">
                    <Image
                      src="/temperature.png"
                      alt="Weather Icon"
                      width={25} // Set the desired width
                      height={25} // Set the desired height
                    />
                    Feels Like
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center">
                  <div className="text-black text-3xl ">
                    {data?.current?.feelslike_c}
                    <span className="text-[#A3A3A3] text-sm">°C</span>
                  </div>
                  <div className="text-black text-3xl ml-auto">
                    {data?.current?.feelslike_f}
                    <span className="text-[#A3A3A3] text-sm">°F</span>
                  </div>
                </CardContent>
              </Card>
            </CardFooter>
          </Card>
        </div>
        <div className="flex space-x-5 items-stretch">
          <Card className="w-2/5">
            <CardHeader>
              <CardDescription className="flex items-center">
                {day} days Forecast
                <Select
                  onValueChange={(value) => {
                    setDay(Number(value));
                  }}
                >
                  <SelectTrigger className="w-[100px] ml-auto">
                    <SelectValue defaultValue={7} placeholder="7 Days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="10">10 Days</SelectItem>
                    <SelectItem value="13">13 Days</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-72 overflow-scroll">
              {data &&
                data.forecast.forecastday.map(
                  (forecastDay: ForecastDay, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4 flex items-center space-x-3">
                        <WeatherIcon
                          code={data.current.condition.code}
                          isDay={data.current.is_day === 1 ? 1 : 0}
                          width={50}
                          height={50}
                        />

                        <div>{forecastDay.day.avgtemp_c}°c</div>
                        <div>{forecastDay.date}</div>
                        <div className="">
                          Chance Rain %: {forecastDay.day.daily_chance_of_rain}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
            </CardContent>
          </Card>
          <Card className="w-4/5">
            <CardHeader>
              <CardDescription className="flex items-center">
                Historical Data
                <Select
                  onValueChange={(value) => {
                    setYear(Number(value));
                  }}
                >
                  <SelectTrigger className="w-[100px] ml-auto">
                    <SelectValue defaultValue={7} placeholder="2024" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>

            <CardContent className="max-h-72 overflow-scroll flex space-x-3">
              {data?.forecast.forecastday.map((forecastDay, index) => (
                <div key={index}> {forecastDay.day.avghumidity}</div>
              ))}
              {/* {historyData} */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Page;
