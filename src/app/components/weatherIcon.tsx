import React from "react";

interface WeatherIconProps {
  code: number;
  isDay: 0 | 1;
  width: number;
  height: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay,
  width,
  height,
}) => {
  const baseUrl = isDay === 0 ? "/day/" : "/night/";

  const weatherImages: { [key: string]: string } = {
    "1000": "113.png", // Sunny/Clear
    "1003": "116.png", // Partly cloudy
    "1006": "119.png", // Cloudy
    "1009": "122.png", // Overcast
    "1030": "143.png", // Mist
    "1063": "176.png", // Patchy rain possible
    "1066": "179.png", // Patchy snow possible
    "1069": "182.png", // Patchy sleet possible
    "1072": "185.png", // Patchy freezing drizzle possible
    "1087": "200.png", // Thundery outbreaks possible
    "1114": "227.png", // Blowing snow
    "1117": "230.png", // Blizzard
    "1135": "248.png", // Fog
    "1147": "260+.png", // Freezing fog
    "1150": "263.png", // Patchy light drizzle
    "1153": "266.png", // Light drizzle
    "1168": "281.png", // Freezing drizzle
    "1171": "284.png", // Heavy freezing drizzle
    "1180": "293.png", // Patchy light rain
    "1183": "296.png", // Light rain
    "1186": "299.png", // Moderate rain at times
    "1189": "302.png", // Moderate rain
    "1192": "305.png", // Heavy rain at times
    "1195": "308.png", // Heavy rain
    "1198": "311.png", // Light freezing rain
    "1201": "314.png", // Moderate or heavy freezing rain
    "1204": "317.png", // Light sleet
    "1207": "320.png", // Moderate or heavy sleet
    "1210": "323.png", // Patchy light snow
    "1213": "326.png", // Light snow
    "1216": "329.png", // Patchy moderate snow
    "1219": "332.png", // Moderate snow
    "1222": "335.png", // Patchy heavy snow
    "1225": "338.png", // Heavy snow
    "1237": "350.png", // Ice pellets
    "1240": "353.png", // Light rain shower
    "1243": "356.png", // Moderate or heavy rain shower
    "1246": "359.png", // Torrential rain shower
    "1249": "362.png", // Light sleet showers
    "1252": "365.png", // Moderate or heavy sleet showers
    "1255": "368.png", // Light snow showers
    "1258": "371.png", // Moderate or heavy snow showers
    "1261": "374.png", // Light showers of ice pellets
    "1264": "377.png", // Moderate or heavy showers of ice pellets
    "1273": "386.png", // Patchy light rain with thunder
    "1276": "389.png", // Moderate or heavy rain with thunder
    "1279": "392.png", // Patchy light snow with thunder
    "1282": "395.png", // Moderate or heavy snow with thunder
  };

  const imageName = weatherImages[code];
  if (imageName) {
    return (
      <img
        src={`${baseUrl}${imageName}`}
        alt="Weather Icon"
        width={width}
        height={height}
      />
    );
  } else {
    return <div>No image available for this weather condition</div>;
  }
};

export default WeatherIcon;
