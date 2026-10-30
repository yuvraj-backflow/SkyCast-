package com.example.demo.Controller;

import com.example.demo.Dto.DtoResponse;
import com.example.demo.Dto.HourlyForecastResponse;
import com.example.demo.Dto.SevenHourForecastResponse;
import com.example.demo.Service.Weatherservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class Weathercontroller {
@GetMapping("/Home")
public String weather(){
    return "HOME PAGE";
}
    @Autowired
    private Weatherservice weatherservice;
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

@GetMapping("/hourly/next-seven")
public List<SevenHourForecastResponse> getSevenHourForecast(
        @RequestParam double lat,
        @RequestParam double lon
) {
    return weatherservice.getSevenHourForecast(lat, lon);
}
}

