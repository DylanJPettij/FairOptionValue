package com.example.fairoptionvalue.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;

import java.util.List;

public class StockResponse {

    private String ticker;
    private int queryCount;
    private int resultsCount;
    private boolean adjusted;
    private List<Result> results;
    private String status;

    @JsonProperty("request_id")
    private String requestId;

    private int count;

    // Getters and Setters

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public int getQueryCount() {
        return queryCount;
    }

    public void setQueryCount(int queryCount) {
        this.queryCount = queryCount;
    }

    public int getResultsCount() {
        return resultsCount;
    }

    public void setResultsCount(int resultsCount) {
        this.resultsCount = resultsCount;
    }

    public boolean isAdjusted() {
        return adjusted;
    }

    public void setAdjusted(boolean adjusted) {
        this.adjusted = adjusted;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    // Nested class for results
    public static class Result {
        private double v;  // volume
        private double vw; // volume weighted price
        private double o;  // open
        private double c;  // close
        private double h;  // high
        private double l;  // low
        private long t;    // timestamp
        private long n;    // transactions

        // Getters and Setters
        public double getV() {
            return v;
        }

        public void setV(double v) {
            this.v = v;
        }

        public double getVw() {
            return vw;
        }

        public void setVw(double vw) {
            this.vw = vw;
        }

        public double getO() {
            return o;
        }

        public void setO(double o) {
            this.o = o;
        }

        public double getC() {
            return c;
        }

        public void setC(double c) {
            this.c = c;
        }

        public double getH() {
            return h;
        }

        public void setH(double h) {
            this.h = h;
        }

        public double getL() {
            return l;
        }

        public void setL(double l) {
            this.l = l;
        }

        public long getT() {
            return t;
        }

        public void setT(long t) {
            this.t = t;
        }

        public long getN() {
            return n;
        }

        public void setN(long n) {
            this.n = n;
        }
    }
}
