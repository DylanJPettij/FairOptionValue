package com.example.fairoptionvalue.api.controller;

import com.example.fairoptionvalue.enums.OptionType;
import com.example.fairoptionvalue.enums.TotalOptionType;
import com.example.fairoptionvalue.models.HistoricalDataRequest;
import com.example.fairoptionvalue.models.VolStats;
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
    public double PostFairOptionValue(@RequestBody HistoricalDataRequest historicalDataRequest, String option) {

        OptionsService OS = new OptionsService();

        //Solve for the Standard Deviation of returns
        VolStats volStats = OS.GetVolatility(historicalDataRequest.getStockTicker());

        //get the current risk-free rate
        double rfr = OS.GetCurrentRates();

        StockResponse historicalData = OS.GetHistoricalStockData(historicalDataRequest);

        return 0;
    }


    @GetMapping("/options/black")
    public double CalcBlackScholes() {
        OptionsService OS = new OptionsService();
        //verified the math is functioning correctly
        //This data will actually be pulled from a selected option instead of prompting the user for this information.
        double value = OS.BlackScholesCalculation(OptionType.CALL, 235.84, 235, .0405, 4, .2586);
        double value2 = OS.BlackScholesCalculation(OptionType.PUT, 235.84, 235, .0405, 4, .2586);
        return value;
    }
    @GetMapping("/options/binomial")
    public double CalcBinomial() {
        OptionsService OS = new OptionsService();
        TotalOptionType totalOptionType = new TotalOptionType();

        totalOptionType.setOptionType(OptionType.PUT);
        totalOptionType.setMarketplace(TotalOptionType.Market.European);

        double binomCalc = OS.CCRBinomial(50,52,.05,.02,0.50,0.30,3,totalOptionType);

        return 0;
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
