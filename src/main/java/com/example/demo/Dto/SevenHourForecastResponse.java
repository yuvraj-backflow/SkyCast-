package com.example.demo.Dto;


public record SevenHourForecastResponse(
        long timestamp,
        double temperature,
        int weatherCode
) {}
