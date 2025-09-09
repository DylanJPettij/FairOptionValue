package com.example.fairoptionvalue.models;

public class VolStats {
    private double sumClose;
    private double meanClose;
    private double lengthClose;
    private double volatility;

    public double getSumClose() {
        return sumClose;
    }
    public void setSumClose(double sumClose) {
        this.sumClose = sumClose;
    }
    public double getMeanClose() {
        return meanClose;
    }
    public void setMeanClose(double meanClose) {
        this.meanClose = meanClose;
    }
    public double getLengthClose() {
        return lengthClose;
    }
    public void setLengthClose(double lengthClose) {
        this.lengthClose = lengthClose;
    }
    public double getVolatility() {
        return volatility;
    }
    public void setVolatility(double volatility) {
        this.volatility = volatility;
    }
}
