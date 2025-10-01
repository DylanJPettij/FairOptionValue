package com.example.fairoptionvalue.models;

import com.example.fairoptionvalue.enums.OptionType;
import com.example.fairoptionvalue.enums.TotalOptionType.Market;
import com.example.fairoptionvalue.enums.TotalOptionType;

public class FairValueRequest {


    private String market;
    private String optionType;
    private double stockPrice;
    private double strikePrice;
    private double rfr;
    private double contDividendYield;
    private double timeToExpiry;
    private double volatility;
    private int steps;


    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }

    public double getStockPrice() {
        return stockPrice;
    }

    public void setStockPrice(double stockPrice) {
        this.stockPrice = stockPrice;
    }

    public double getStrikePrice() {
        return strikePrice;
    }

    public void setStrikePrice(double strikePrice) {
        this.strikePrice = strikePrice;
    }

    public double getRfr() {
        return rfr;
    }

    public void setRfr(double rfr) {
        this.rfr = rfr;
    }

    public double getContDividendYield() {
        return contDividendYield;
    }

    public void setContDividendYield(double contDividendYield) {
        this.contDividendYield = contDividendYield;
    }

    public double getTimeToExpiry() {
        return timeToExpiry;
    }

    public void setTimeToExpiry(double timeToExpiry) {
        this.timeToExpiry = timeToExpiry;
    }

    public double getVolatility() {
        return volatility;
    }

    public void setVolatility(double volatility) {
        this.volatility = volatility;
    }

    public int getSteps() {
        return steps;
    }

    public void setSteps(int steps) {
        this.steps = steps;
    }

    public String getOptionType() {
        return optionType;
    }

    public void setOptionType(String optionType) {
        this.optionType = optionType;
    }
}
