import React from "react";

const parseAndConvertTo24Hour = (timeStr: string): Date => {
  if (!timeStr) return new Date();

  const [time, period] = timeStr.split(" ");
  const [hoursStr, minutesStr] = time.split(":");
  let hours24 = parseInt(hoursStr);
  if (period === "PM" && hours24 !== 12) hours24 += 12;
  if (period === "AM" && hours24 === 12) hours24 = 0;
  return new Date(0, 0, 0, hours24, parseInt(minutesStr));
};

export const calculateSunDuration = (
  sunrise: string,
  sunset: string
): string => {
  const sunriseTime = parseAndConvertTo24Hour(sunrise);
  const sunsetTime = parseAndConvertTo24Hour(sunset);

  const durationInMillis = sunsetTime.getTime() - sunriseTime.getTime();

  const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
  const minutes = Math.floor(
    (durationInMillis % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${hours} hours and ${minutes} minutes`;
};

export const calculateMoonDuration = (
  moonrise: string,
  moonset: string
): string => {
  const moonriseTime = parseAndConvertTo24Hour(moonrise);
  const moonsetTime = parseAndConvertTo24Hour(moonset);

  const durationInMillis = moonsetTime.getTime() - moonriseTime.getTime();

  const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
  const minutes = Math.floor(
    (durationInMillis % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${hours} hours and ${minutes} minutes`;
};

const calculation = () => {
  return <div></div>;
};

export default calculation;
