import { Cloud, CloudRain, CloudSun, Snowflake, Sun } from "lucide-react";

function formatHour(timestamp) {
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: true, timeZone: "UTC" }).format(new Date(timestamp * 1000));
}

function ForecastIcon({ weatherCode }) {
  if (weatherCode === 0) return <Sun />;
  if ([1, 2].includes(weatherCode)) return <CloudSun />;
  if (weatherCode === 3 || [45, 48].includes(weatherCode)) return <Cloud />;
  if (weatherCode >= 71 && weatherCode <= 77) return <Snowflake />;
  return <CloudRain />;
}

export default function SevenHourForecast({ forecast }) {
  return (
    <section className="seven-hour-section">
      <div className="section-heading">
        <div><p className="eyebrow">Hourly outlook</p><h2>Next 7 hours</h2></div>
        <span className="live-dot">Live</span>
      </div>
      {forecast.length ? (
        <div className="seven-hour-list">
          {forecast.map((hour) => <article className="hour-card" key={hour.timestamp}>
            <time>{formatHour(hour.timestamp)}</time>
            <span className="hour-icon"><ForecastIcon weatherCode={hour.weatherCode} /></span>
            <strong>{Math.round(hour.temperature)}°</strong>
          </article>)}
        </div>
      ) : <div className="seven-hour-empty">Search for a city to see the hourly forecast.</div>}
    </section>
  );
}
