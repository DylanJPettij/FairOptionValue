package com.example.fairoptionvalue.models;

import com.example.fairoptionvalue.enums.TotalOptionType;
import com.example.fairoptionvalue.service.OptionsService;

public class Binomial extends Thread {
    private double stockPrice, strikePrice, rfr, contDividendYield, timeToExpiry, volatility;
    private int steps;
    private TotalOptionType totalOptionType;
    private double CCRVal;


    public Binomial(double stockPrice,double strikePrice,double rfr,double contDividendYield,double timeToExpiry,double volatility, int steps, TotalOptionType totalOptionType) {
    this.stockPrice = stockPrice;
    this.strikePrice = strikePrice;
    this.rfr = rfr;
    this.contDividendYield = contDividendYield;
    this.timeToExpiry = timeToExpiry;
    this.volatility = volatility;
    this.totalOptionType = totalOptionType;
    this.steps = steps;
    }

    public double getCCRVal() {
        return CCRVal;
    }
    public void setCCRVal(double CCRVal) {
        this.CCRVal = CCRVal;
    }

    @Override
    public void run()
    {
        OptionsService OS = new OptionsService();
        double CCR = OS.CCRBinomial(stockPrice, strikePrice, rfr, contDividendYield,
                timeToExpiry, volatility, steps, totalOptionType);
        setCCRVal(CCR);
    }
    public double getStockPrice() {
        return stockPrice;
    }
    public void setStockPrice(double stockPrice) {
        this.stockPrice = stockPrice;
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
    public TotalOptionType getTotalOptionType() {
        return totalOptionType;
    }
    public void setTotalOptionType(TotalOptionType totalOptionType) {
        this.totalOptionType = totalOptionType;
    }
}