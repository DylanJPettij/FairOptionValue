package com.example.fairoptionvalue.models;

public class BinomialBlackScholesReturn {
    private double binomial;
    private double blackScholes;

    public double getBinomial() {
        return binomial;
    }

    public double getBlackScholes() {
        return blackScholes;
    }

    public void setBlackScholes(double blackScholes) {
        this.blackScholes = blackScholes;
    }

    public void setBinomial(double binomial) {
        this.binomial = binomial;
    }
}
