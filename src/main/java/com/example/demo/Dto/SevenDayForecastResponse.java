package com.example.demo.Dto;

public record SevenDayForecastResponse(
        long timestamp,
        double minimumTemperature,
        double maximumTemperature,
        int weatherCode
) {}
