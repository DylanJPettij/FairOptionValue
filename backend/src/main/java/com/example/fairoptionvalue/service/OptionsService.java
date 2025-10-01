package com.example.fairoptionvalue.service;

import com.example.fairoptionvalue.enums.OptionType;
import com.example.fairoptionvalue.enums.TotalOptionType;
import com.example.fairoptionvalue.models.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.math3.stat.regression.OLSMultipleLinearRegression;
import org.springframework.stereotype.Service;
import org.apache.commons.math3.linear.*;

import java.math.BigDecimal;
import java.util.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.apache.commons.math3.distribution.NormalDistribution;

import static com.example.fairoptionvalue.service.StubData.createSpyStubFull;

@Service
public class OptionsService {

    public double GetCurrentRates() {
        String FedAPIKey = "6155af3ca351969046dfffb58e1bba36";

        //DGS10 is the 10-year treasury
        String SeriesCode = "DGS10";
        // String FedURL ="https://api.stlouisfed.org/fred/series/observations?series_id=" + SeriesCode + "&api_key=" +
        //       FedAPIKey +" &file_type=json";
        int week = 7;
        LocalDate today = LocalDate.now().minusDays(week);
        String formattedToday = today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String FedURL = "https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=6155af3ca351969046dfffb58e1bba36&observation_start=" + formattedToday + "&limit=1&sort_order=desc&file_type=json";
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(FedURL))
                .GET().build();
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.body());
            FedRateData fedRateData = mapper.convertValue(jsonNode, FedRateData.class);

            return Double.parseDouble(fedRateData.getObservations().get(0).getValue());


        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    public double TimeToExpiration(double daysToExpiration) {
        double year = 365;
        return daysToExpiration / year;

    }
    //Black-Scholes-Merton (BSM) model used to factor for dividends

    public double BlackScholesCalculation(OptionType optionType, double stockPrice, double strikePrice, double rfr, double timeToExp,
                                          double standardDev, double contDividendYield) {
        double timeToExpiry = TimeToExpiration(timeToExp);

        double d1 = (Math.log(stockPrice / strikePrice) + (rfr - contDividendYield + Math.pow(standardDev, 2) / 2) * timeToExpiry) / (standardDev * Math.sqrt(timeToExpiry));

        double d2 = d1 - (standardDev * Math.sqrt(timeToExpiry));

        NormalDistribution normal = new NormalDistribution();
        double nd1 = normal.cumulativeProbability(d1);
        double nd2 = normal.cumulativeProbability(d2);

        if (optionType == OptionType.CALL) {

            double CallValue = stockPrice * nd1 - strikePrice *
                    Math.pow(Math.E, -rfr * timeToExpiry) * nd2;
            return CallValue;
        }


        if (optionType == OptionType.PUT) {
            double PutValue = strikePrice * Math.pow(Math.E, -rfr * timeToExpiry) * normal.cumulativeProbability(-d2)
                    - stockPrice * normal.cumulativeProbability(-d1);
            return PutValue;
        }

        return 0;
    }

    public double CCRBinomial(double stockPrice, double strikePrice, double rfr, double contDividendYield, double timeToExpiry,
                              double volatility, int steps, TotalOptionType totalOptionType) {

        if (steps == 0) return intrinsic(totalOptionType.getOptionType(), stockPrice, strikePrice);
        contDividendYield = contDividendYield / 100;
        timeToExpiry = TimeToExpiration(timeToExpiry);
        double deltaT = timeToExpiry / steps;


        double upSize = Math.exp(volatility * Math.sqrt(deltaT));
        double downSize = 1.0 / upSize;
        double disc = Math.exp(-rfr * deltaT);
        double drift = Math.exp((rfr - contDividendYield) * deltaT);


        double probability = (drift - downSize) / (upSize - downSize);
        double probabilityDown = 1.0 - probability;

        double[] optionPrices = new double[steps + 1];


        double stockP_T = stockPrice * Math.pow(downSize, steps);

        for (int j = 0; j <= steps; j++) {
            optionPrices[j] = intrinsic(totalOptionType.getOptionType(), stockP_T, strikePrice);
            stockP_T *= (upSize / downSize);
        }


        for (int i = steps - 1; i >= 0; i--) {
            for (int j = 0; j <= i; j++) {

                double stockP_current = stockPrice * Math.pow(upSize, j) * Math.pow(downSize, i - j);


                double continuation = disc * (probability * optionPrices[j + 1] +
                        probabilityDown * optionPrices[j]);


                if (totalOptionType.getMarketplace().equals(TotalOptionType.Market.American)) {
                    double exercise = intrinsic(totalOptionType.getOptionType(), stockP_current, strikePrice);
                    optionPrices[j] = Math.max(continuation, exercise);
                } else {

                    optionPrices[j] = continuation;
                }
            }
        }

        return optionPrices[0];
    }

    private static double intrinsic(OptionType option, double stockP, double strikePrice) {
        return option == OptionType.CALL ? Math.max(0.0, stockP - strikePrice) : Math.max(0.0, strikePrice - stockP);
    }

    public double ToDecimal(double value) {

        value = Math.round(value * 10000.0) / 10000.0;
        return value;
    }

    public BinomialBlackScholesReturn GetFairValue(double stockPrice, double strikePrice, double rfr, double contDividendYield, double timeToExpiry,
                                                   double volatility, int steps, TotalOptionType totalOptionType) {
        contDividendYield = contDividendYield / 100;
        Binomial binomial = new Binomial(stockPrice, strikePrice, rfr, contDividendYield, timeToExpiry, volatility, steps, totalOptionType);
        BlackScholes blackScholes = new BlackScholes(stockPrice, strikePrice, rfr, timeToExpiry, volatility, totalOptionType, contDividendYield);

        binomial.start();
        blackScholes.start();
        try {
            binomial.join();
            blackScholes.join();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }


        double CCRValue = binomial.getCCRVal();
        CCRValue = ToDecimal(CCRValue);

        double blackScholesValue = blackScholes.getBlackScholesValue();
        blackScholesValue = ToDecimal(blackScholesValue);


        BinomialBlackScholesReturn bbsr = new BinomialBlackScholesReturn();
        bbsr.setBinomial(CCRValue);
        bbsr.setBlackScholes(blackScholesValue);


        return bbsr;
    }

}
