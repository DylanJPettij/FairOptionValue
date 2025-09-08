package com.example.fairoptionvalue.api.controller;

import com.example.fairoptionvalue.models.HistoricalDataRequest;
import com.example.fairoptionvalue.service.OptionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.fairoptionvalue.models.BlackScholes;

import com.example.fairoptionvalue.models.StockResponse;

@RestController
public class OptionsController {

    private OptionsService optionsService;

    @Autowired
    public OptionsController(OptionsService optionsService) {
        this.optionsService = optionsService;
    }

    @PostMapping("/options/fv")
    public double PostFairOptionValue(@RequestBody HistoricalDataRequest historicalDataRequest) {

        OptionsService OS = new OptionsService();
        double vol = OS.GetVolatility();
        StockResponse historicalData = OS.GetHistoricalStockData(historicalDataRequest);

        return vol;
    }


    @GetMapping("/options/rates")
    public double GetCurrentTenYearRate() {

        OptionsService OS = new OptionsService();
        try {
            //convert rate to a percentage div by 100
            double rate = OS.GetCurrentRates() / 100;
            return rate;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
