import { Cloud, CloudRain, CloudSun, Snowflake, Sun } from "lucide-react";

function formatDay(timestamp) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(new Date(timestamp * 1000));
}

function ForecastIcon({ weatherCode }) {
  if (weatherCode === 0) return <Sun />;
  if ([1, 2].includes(weatherCode)) return <CloudSun />;
  if (weatherCode === 3 || [45, 48].includes(weatherCode)) return <Cloud />;
  if (weatherCode >= 71 && weatherCode <= 77) return <Snowflake />;
  return <CloudRain />;
}

export default function SevenDayForecast({ forecast }) {
  return (
    <section className="seven-day-section">
      <div className="section-heading">
        <div><p className="eyebrow">Daily outlook</p><h2>Next 7 days</h2></div>
        <span className="live-dot">Live</span>
      </div>
      {forecast.length ? (
        <div className="seven-day-list">
          {forecast.map((day) => <article className="day-card" key={day.timestamp}>
            <time>{formatDay(day.timestamp)}</time>
            <span className="day-icon"><ForecastIcon weatherCode={day.weatherCode} /></span>
            <strong>{Math.round(day.maximumTemperature)}°</strong>
            <small>{Math.round(day.minimumTemperature)}°</small>
          </article>)}
        </div>
      ) : <div className="seven-day-empty">Search for a city to see the seven-day forecast.</div>}
    </section>
  );
}
