package com.example.demo.Controller;

import com.example.demo.Dto.DtoResponse;
import com.example.demo.Dto.HourlyForecastResponse;
import com.example.demo.Dto.SevenDayForecastResponse;
import com.example.demo.Service.Weatherservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class Weathercontroller {
    @Autowired
    private Weatherservice weatherservice;
    //Se
@GetMapping("/{city}")
public DtoResponse getWeather(@PathVariable String city){
        return weatherservice.getWeather(city);
}

@GetMapping("/hourly")
    public List<HourlyForecastResponse> getHourlyForecast(
            @RequestParam double lat,
            @RequestParam double lon
){
    return weatherservice.getHourlyForecast(lat,lon);
}

@GetMapping("/daily")
public List<SevenDayForecastResponse> getSevenDayForecast(
        @RequestParam double lat,
        @RequestParam double lon
) {
    return weatherservice.getSevenDayForecast(lat, lon);
}
}

