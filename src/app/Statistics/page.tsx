"use client";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import AreaCharts from "../components/chart/areaChart";

import { IoSearchCircleOutline } from "react-icons/io5";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import Error from "@/error";
import Loading from "@/loading";
import { fetchHistoryData, fetchWeatherData } from "../api/route";

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

const page = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [historyData, setHistoryData] = useState(null);
  const [category, setCategory] = useState("temp_c");
  const [filter, setFilter] = useState(1);
  const [x, setX] = useState<number[]>([]);
  const [y, setY] = useState<string[]>([]);
  const [inputCity, setInputCity] = useState("Puchong");
  const [defaultCity, setDefaultCity] = useState("Puchong");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [year, setYear] = useState<number>(2024);

  useEffect(() => {
    fetchForeCastData(defaultCity, category, filter);
  }, [defaultCity, category, filter]);

  const fetchForeCastData = async (
    city: string,
    category: string,
    filter: number
  ) => {
    try {
      const jsonData = await fetchWeatherData(city, filter);

      setData(jsonData);
      setLoading(true);

      let tempDataX: number[] = [];
      let tempDataY: string[] = [];

      switch (category) {
        case "temp_c":
        case "precip_mm":
        case "wind_kph":
        case "humidity":
        case "uv":
          tempDataX = [];
          tempDataY = [];
          jsonData.forecast?.forecastday?.forEach(
            (forecastDay: ForecastDay) => {
              forecastDay?.hour.forEach((hour: Hour) => {
                tempDataX.push(hour[category]);
                tempDataY.push(hour.time);
              });
            }
          );
          setX(tempDataX);
          setY(tempDataY);
          break;
        case "co":
          tempDataX = [];
          tempDataY = [];
          jsonData.forecast?.forecastday?.forEach(
            (forecastDay: ForecastDay) => {
              forecastDay?.hour.forEach((hour: Hour) => {
                tempDataX.push(hour.air_quality.co);
                tempDataY.push(hour.time);
              });
            }
          );
          setX(tempDataX);
          setY(tempDataY);
          break;
        case "no2":
          tempDataX = [];
          tempDataY = [];
          jsonData.forecast?.forecastday?.forEach(
            (forecastDay: ForecastDay) => {
              forecastDay?.hour.forEach((hour: Hour) => {
                tempDataX.push(hour.air_quality.no2);
                tempDataY.push(hour.time);
              });
            }
          );
          setX(tempDataX);
          setY(tempDataY);
          break;
        default:
          tempDataX = [];
          tempDataY = [];
          jsonData.forecast?.forecastday
            .slice(0, filter)
            .forEach((forecastDay: ForecastDay) => {
              forecastDay?.hour.forEach((hour: Hour) => {
                tempDataX.push(hour.temp_c);
                tempDataY.push(hour.time);
              });
            });
          setX(tempDataX);
          setY(tempDataY);
          break;
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHistoryDatas;
  }, [defaultCity, year]);
  console.log("history", historyData);

  const fetchHistoryDatas = async (city: string, year: number) => {
    try {
      const historyData = await fetchHistoryData(city, year);
      setHistoryData(historyData);
      setLoading(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleSearch = () => {
    const city = inputCity.trim();
    if (city !== "") {
      setDefaultCity(city);
      fetchForeCastData(city, category, filter);
    }
  };

  return (
    <>
      <div>
        <div className={cn("dashboard-header", "w-1/3", "relative")}>
          <Input
            type="text"
            id="cityInput"
            placeholder="Search for your location"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          ></Input>
          <IoSearchCircleOutline
            className="search-icon absolute top-0.5 right-2"
            size={36}
            onClick={handleSearch}
          />
        </div>
        <div>
          <div className="flex p-4 space-x-3 my-10  w-full">
            <Select
              defaultValue={category}
              onValueChange={(value) => {
                setCategory(value);
                fetchForeCastData(inputCity, value, filter);
              }}
            >
              <SelectTrigger className="w-[180px] bg-white dark:bg-black">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temp_c">Temperature (°C)</SelectItem>
                <SelectItem value="precip_mm">Precipitation (mm)</SelectItem>
                <SelectItem value="wind_kph">Wind Speed (km/h)</SelectItem>
                <SelectItem value="humidity">Humidity (%)</SelectItem>
                <SelectItem value="uv">UV Index</SelectItem>
                {/* <SelectItem value="co">CO (Carbon Monoxide)</SelectItem>
                <SelectItem value="no2">NO2 (Nitrogen Dioxide)</SelectItem> */}
              </SelectContent>
            </Select>
            <Select
              defaultValue={String(filter)}
              onValueChange={(value) => {
                setFilter(parseInt(value));
                fetchForeCastData(inputCity, category, parseInt(value));
              }}
            >
              <SelectTrigger className="w-[180px] bg-white dark:bg-black">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                {/* <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="10">10</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          {!error ? (
            <div className="space-y-5">
              <div className=" bg-white p-5 rounded-xl dark:bg-black">
                {data && (
                  <AreaCharts x={x} y={y} category={category} day={filter} />
                )}
              </div>
              <div className=" w-max-[1000px] overflow-auto ">
                <div className="flex flex-col justify-center items-center min-h-56 rounded-xl w-full">
                  <div className="p-5 rounded-xl flex justify-center items-center space-x-5 ">
                    {category === "temp_c" &&
                      data &&
                      data.forecast?.forecastday?.map((forecastDay) =>
                        forecastDay?.hour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center bg-white rounded-xl min-h-56 w-44 text-center dark:bg-black"
                          >
                            {hour.condition.text}
                            <img src={hour.condition.icon} alt="Weather Icon" />
                            <p>{hour.time}</p>
                            <p>{hour.temp_c} °C</p>
                          </div>
                        ))
                      )}
                    {category === "precip_mm" &&
                      data &&
                      data.forecast?.forecastday?.map((forecastDay) =>
                        forecastDay?.hour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center bg-white rounded-xl min-h-56 w-44 text-center"
                          >
                            {hour.condition.text}
                            <img src={hour.condition.icon} alt="Weather Icon" />
                            <p>{hour.time}</p>
                            <p>{hour.precip_mm} mm</p>
                          </div>
                        ))
                      )}
                    {category === "wind_kph" &&
                      data &&
                      data.forecast?.forecastday?.map((forecastDay) =>
                        forecastDay?.hour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center bg-white rounded-xl min-h-56 w-44 text-center"
                          >
                            {hour.condition.text}
                            <img src={hour.condition.icon} alt="Weather Icon" />
                            <p>{hour.time}</p>
                            <p>{hour.wind_kph} km/h</p>
                          </div>
                        ))
                      )}
                    {category === "humidity" &&
                      data &&
                      data.forecast?.forecastday?.map((forecastDay) =>
                        forecastDay?.hour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center bg-white rounded-xl min-h-56 w-44 text-center"
                          >
                            {hour.condition.text}
                            <img src={hour.condition.icon} alt="Weather Icon" />
                            <p>{hour.time}</p>
                            <p>{hour.humidity} %</p>
                          </div>
                        ))
                      )}
                    {category === "uv" &&
                      data &&
                      data.forecast?.forecastday?.map((forecastDay) =>
                        forecastDay?.hour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center bg-white rounded-xl min-h-56 w-44 text-center"
                          >
                            {hour.condition.text}
                            <img src={hour.condition.icon} alt="Weather Icon" />
                            <p>{hour.time}</p>
                            <p>{hour.uv} index</p>
                          </div>
                        ))
                      )}
                    {category === "co" &&
                      data &&
                      data.forecast?.forecastday?.map((forecastDay) =>
                        forecastDay?.hour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center bg-white rounded-xl min-h-56 w-44 text-center"
                          >
                            {hour.condition.text}
                            <img src={hour.condition.icon} alt="Weather Icon" />
                            <p>{hour.time}</p>
                            <p>{hour.air_quality.co}</p>
                          </div>
                        ))
                      )}
                    {category === "no2" &&
                      data &&
                      data.forecast?.forecastday?.map((forecastDay) =>
                        forecastDay?.hour.map((hour, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center bg-white rounded-xl min-h-56 w-44 text-center"
                          >
                            {hour.condition.text}
                            <img src={hour.condition.icon} alt="Weather Icon" />
                            <p>{hour.time}</p>
                            <p>{hour.air_quality.no2}</p>
                          </div>
                        ))
                      )}
                  </div>
                </div>
              </div>
            </div>
          ) : loading ? (
            <Loading />
          ) : (
            <Error />
          )}
        </div>
      </div>
    </>
  );
};

export default page;
