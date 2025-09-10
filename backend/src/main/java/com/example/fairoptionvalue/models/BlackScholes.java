package com.example.fairoptionvalue.models;

import com.example.fairoptionvalue.enums.TotalOptionType;
import com.example.fairoptionvalue.service.OptionsService;

public class BlackScholes extends Thread {

    private double stockPrice, strikePrice, rfr, contDividendYield, timeToExpiry, volatility;
    private int steps;
    private TotalOptionType totalOptionType;
    private double blackScholesValue;

    public BlackScholes(double stockPrice,double strikePrice,double rfr, double timeToExpiry,double volatility, TotalOptionType totalOptionType, double contDividendYield) {
    this.stockPrice = stockPrice;
    this.strikePrice = strikePrice;
    this.rfr = rfr;
    this.timeToExpiry = timeToExpiry;
    this.volatility = volatility;
    this.totalOptionType = totalOptionType;
    this.steps = steps;
    this.contDividendYield = contDividendYield;
    }



    @Override
    public void run()
    {
        OptionsService OS = new OptionsService();
        double num = OS.BlackScholesCalculation(totalOptionType.getOptionType(), stockPrice, strikePrice, rfr,
                timeToExpiry, volatility, contDividendYield);
        setBlackScholesValue(num);

    }

    public double getBlackScholesValue() {
        return blackScholesValue;
    }
    public void setBlackScholesValue(double blackScholesValue) {
        this.blackScholesValue = blackScholesValue;
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
    double getTimeToExpiry() {
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
    public double getContDividendYield() {
        return contDividendYield;
    }
    public void setContDividendYield(double contDividendYield) {
        this.contDividendYield = contDividendYield;
    }


}