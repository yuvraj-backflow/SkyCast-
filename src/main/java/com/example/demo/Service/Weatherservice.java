package com.example.demo.Service;

import com.example.demo.Dto.DtoResponse;
import com.example.demo.Dto.HourlyForecastResponse;
import com.example.demo.Dto.SevenHourForecastResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class Weatherservice {
   private final RestTemplate restTemplate;
   private final  ObjectMapper objectMapper;
private final SearchHistoryService searchHistoryService;
   public Weatherservice(RestTemplate restTemplate, ObjectMapper objectMapper, SearchHistoryService searchHistoryService) {
       this.objectMapper = objectMapper;
       this.restTemplate = restTemplate;
       this.searchHistoryService = searchHistoryService;
   }
@Value("${weather.api.key}")
    private String apiKey;
@Value("${weather.api.url}")
    private String apiUrl;
@Value("${weather.hourly-forecast.url}")
    private String hourlyForecastUrl;
//Making of the url
public DtoResponse getWeather(String city){
String url= UriComponentsBuilder.fromUriString(apiUrl+"/weather")
        .queryParam("q",city)
        .queryParam("appid",apiKey)
        .queryParam("units","metric")
        .toUriString();
String response=restTemplate.getForObject(url,String.class);
try {
    JsonNode jsonNode = objectMapper.readTree(response);
    JsonNode weatherarray = jsonNode.path("weather");
    JsonNode firstWeather = weatherarray.get(0);

  DtoResponse WeatherResponse =   new DtoResponse(
            jsonNode.path("name").asText(),
            jsonNode.path("main").path("temp").asDouble(),
            jsonNode.path("wind").path("speed").asDouble(),
            jsonNode.path("main").path("humidity").asInt(),
            firstWeather.path("description").asText()

    );
 searchHistoryService.saveSearch(WeatherResponse.city());
 return WeatherResponse;

} catch (Exception e) {
        throw new RuntimeException("Error getting weather data",e);
}
}
    /**
     * Returns the next 24 hours of forecast points for the temperature chart.
     * OpenWeather's standard forecast API supplies values at three-hour intervals,
     * so the first eight points make up the next 24-hour temperature trend.
     */
    public List<HourlyForecastResponse> getHourlyForecast(
            double latitude,
            double longitude
    ) {
        try {
            String url = UriComponentsBuilder
                    .fromUriString(apiUrl + "/forecast")
                    .queryParam("lat", latitude)
                    .queryParam("lon", longitude)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(response);
            JsonNode forecastData = root.path("list");

            if (!forecastData.isArray() || forecastData.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The weather provider returned no forecast data");
            }

            List<HourlyForecastResponse> forecastList = new ArrayList<>();

            for (JsonNode hour : forecastData) {
                forecastList.add(new HourlyForecastResponse(
                        hour.path("dt").asLong(),
                        hour.path("main").path("temp").asDouble()
                ));

                if (forecastList.size() == 8) {
                    break;
                }
            }

            return forecastList;

        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Unable to retrieve the temperature trend", exception);
        }
    }

    /**
     * Retrieves seven consecutive, hourly forecast points.  This is kept separate
     * from the three-hour OpenWeather trend feed so the forecast panel has true
     * hour-by-hour values.
     */
    public List<SevenHourForecastResponse> getSevenHourForecast(double latitude, double longitude) {
        try {
            String url = UriComponentsBuilder.fromUriString(hourlyForecastUrl)
                    .queryParam("latitude", latitude)
                    .queryParam("longitude", longitude)
                    .queryParam("hourly", "temperature_2m,weather_code")
                    .queryParam("forecast_hours", 7)
                    .queryParam("timezone", "UTC")
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            JsonNode hourly = objectMapper.readTree(response).path("hourly");
            JsonNode times = hourly.path("time");
            JsonNode temperatures = hourly.path("temperature_2m");
            JsonNode weatherCodes = hourly.path("weather_code");

            if (!times.isArray() || !temperatures.isArray() || !weatherCodes.isArray()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "The weather provider returned incomplete hourly forecast data");
            }

            int numberOfHours = Math.min(7, Math.min(times.size(), Math.min(temperatures.size(), weatherCodes.size())));
            List<SevenHourForecastResponse> forecast = new ArrayList<>();

            for (int index = 0; index < numberOfHours; index++) {
                long timestamp = LocalDateTime.parse(times.get(index).asText())
                        .toEpochSecond(ZoneOffset.UTC);
                forecast.add(new SevenHourForecastResponse(
                        timestamp,
                        temperatures.get(index).asDouble(),
                        weatherCodes.get(index).asInt()
                ));
            }

            return forecast;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Unable to retrieve the seven-hour forecast", exception);
        }
    }
}




