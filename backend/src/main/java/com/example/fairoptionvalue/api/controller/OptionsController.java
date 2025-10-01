package com.example.fairoptionvalue.api.controller;

import com.example.fairoptionvalue.enums.OptionType;
import com.example.fairoptionvalue.enums.TotalOptionType;
import com.example.fairoptionvalue.models.*;
import com.example.fairoptionvalue.service.OptionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Optional;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class OptionsController {

    private OptionsService optionsService;

    @Autowired
    public OptionsController(OptionsService optionsService) {
        this.optionsService = optionsService;
    }


    //this endpoint was just for testing
    @GetMapping("/options/black")
    public double CalcBlackScholes() {
        OptionsService OS = new OptionsService();
        //verified the math is functioning correctly
        //This data will actually be pulled from a selected option instead of prompting the user for this information.
        //double value = OS.BlackScholesCalculation(OptionType.CALL, 235.84, 235, .0405, 4, .2586);
        //double value2 = OS.BlackScholesCalculation(OptionType.PUT, 235.84, 235, .0405, 4, .2586);
        return 0;
    }

    //this endpoint was just for testing
    @GetMapping("/options/binomial")
    public double CalcBinomial() {
        OptionsService OS = new OptionsService();
        TotalOptionType totalOptionType = new TotalOptionType();

        totalOptionType.setOptionType(OptionType.PUT);
        totalOptionType.setMarketplace(TotalOptionType.Market.European);
        //verified the math is functioning correctly
        //This data will actually be pulled from a selected option instead of prompting the user for this information.
        double binomCalc = OS.CCRBinomial(50, 52, .05, .02, 0.50, 0.30, 3, totalOptionType);

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

    @PostMapping("options/fair")
    public Optional<BinomialBlackScholesReturn> CalcFair(@RequestBody FairValueRequest fairValueRequest) {
        OptionsService OS = new OptionsService();
        TotalOptionType totalOptionType = new TotalOptionType();

        FairValueRequest fv = fairValueRequest;

        totalOptionType.setMarketplace(TotalOptionType.Market.American);
        if (fv.getOptionType().equals("CALL")) {
            System.out.println("CALL");
            totalOptionType.setOptionType(OptionType.CALL);
        } else {
            System.out.println("this is triggering");
            totalOptionType.setOptionType(OptionType.PUT);
        }


        BinomialBlackScholesReturn fairValues = OS.GetFairValue(fv.getStockPrice(), fv.getStrikePrice(), fv.getRfr(),
                fv.getContDividendYield(), fv.getTimeToExpiry(), fv.getVolatility(), fv.getSteps(), totalOptionType);
        return Optional.ofNullable(fairValues);
    }
}
