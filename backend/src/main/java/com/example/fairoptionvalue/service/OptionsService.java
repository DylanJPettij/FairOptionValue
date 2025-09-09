package com.example.fairoptionvalue.service;

import com.example.fairoptionvalue.enums.OptionType;
import com.example.fairoptionvalue.enums.TotalOptionType;
import com.example.fairoptionvalue.models.FedRateData;
import com.example.fairoptionvalue.models.HistoricalDataRequest;
import com.example.fairoptionvalue.models.StockResponse;
import com.example.fairoptionvalue.models.VolStats;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.math3.distribution.NormalDistribution;

import static com.example.fairoptionvalue.service.StubData.createSpyStubFull;

@Service
public class OptionsService {
    private String apiKey = "rdgLSNEX93x_QBCIcfiA33KTQmPdomvL";
    public String baseUrl = "https://api.polygon.io";

    public StockResponse GetHistoricalStockData(HistoricalDataRequest stockTickerRequest) {
        String combinedRequest = baseUrl + "/v2/aggs/ticker/" + stockTickerRequest.getStockTicker() + "/range/"
                + stockTickerRequest.getMultiplier() + "/" + stockTickerRequest.getTimespan() +
                "/" + stockTickerRequest.getFromDate() + "/" +
                stockTickerRequest.getToDate() + "?adjusted=true&sort=asc&limit=253&apiKey="
                + apiKey;

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(combinedRequest))
                .GET().build();

        System.out.println(request);
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.body());
            StockResponse stockResponse = mapper.convertValue(jsonNode, StockResponse.class);
            return stockResponse;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    public VolStats GetVolatility(String ticker) {

        StockResponse stockTickerResponse = createSpyStubFull();
        List<StockResponse.Result> responses = new ArrayList<>();
        responses = stockTickerResponse.getResults();

        //We need the Sum, Length, and mean to calculate SD
        double sumClose = 0;
        double lengthClose = responses.size();
        double meanClose = 0;

        List<Double> dailyVol = new ArrayList<>();


        for (int i = 1; i < responses.size(); i++) {
            double previousClose = responses.get(i - 1).getC();
            double currentClose = responses.get(i).getC();
            double ratioClose = currentClose / previousClose;
            dailyVol.add(Math.log(ratioClose));
            sumClose += ratioClose;
        }
        meanClose = sumClose / lengthClose;

        //calculate SD
        double standardDev = 0;
        for (double num : dailyVol) {
            standardDev += Math.pow(num - meanClose, 2);
        }
        double volatility = Math.sqrt(standardDev / lengthClose);
        VolStats volStats = new VolStats();
        volStats.setVolatility(volatility);
        volStats.setMeanClose(meanClose);
        volStats.setLengthClose(lengthClose);
        volStats.setSumClose(sumClose);

        return volStats;
    }



    public double GetCurrentStockPrice() {
        //I'm just going to use close data for the project
        //But realistically, this could be pulled from the same API I'm using with a higher tier.

        return 0;
    }

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

    public double BlackScholesCalculation(OptionType optionType, double stockPrice, double strikePrice, double rfr, double timeToExp,
                                          double standardDev) {
        double timeToExpiry = TimeToExpiration(timeToExp);
        System.out.println("TimeToExpiry: " + timeToExpiry);
        System.out.println("StandardDeviation: " + standardDev);

        double d1 = (Math.log(stockPrice / strikePrice) + (rfr + Math.pow(standardDev, 2) / 2) * timeToExpiry) / standardDev * Math.sqrt(timeToExpiry);

        System.out.println("Stock/Strike: " + Math.log(stockPrice/strikePrice));
        System.out.println("(rfr * SD^2)*YRS " + (rfr +Math.pow(standardDev, 2) / 2) * timeToExpiry);


        double d2 = d1 - standardDev * Math.sqrt(timeToExpiry);
        System.out.println("d1 = " + d1);
        System.out.println("d2 = " + d2);

        NormalDistribution normal = new NormalDistribution();
        double nd1 =normal.cumulativeProbability(d1);
        double nd2 = normal.cumulativeProbability(d2);
        System.out.println("normal = " + nd1);
        System.out.println("normal = " + nd2);

        if (optionType == OptionType.CALL) {

            double CallValue = stockPrice * nd1 - strikePrice *
                    Math.pow(Math.E, -rfr * timeToExpiry) * nd2;

                    System.out.println("CallValue = " + CallValue);
            return CallValue;
        }

        
        if (optionType == OptionType.PUT) {
            double PutValue = strikePrice * Math.pow(Math.E, -rfr * timeToExpiry) * normal.cumulativeProbability(-d2)
                    - stockPrice * normal.cumulativeProbability(-d1);

            System.out.println("PutValue = " + PutValue);
            return PutValue;
        }

        return 0;
    }

    public double Rounding(double value)
    {
        double num = Math.round(value * 100000);
        return num/100000;
    }

    public double CCRBinomial(double stockPrice, double strikePrice, double rfr, double contDividendYield , double timeToExpiry,
                              double volatility, int steps, TotalOptionType totalOptionType) {

        if(steps==0) throw new  IllegalArgumentException("steps cannot be 0");

        double deltaT = timeToExpiry / steps;

        double upSize = Math.exp(volatility * Math.sqrt(deltaT));

        double downSize = 1/upSize;

        double disc = Math.exp(-rfr * deltaT);

        double drift = Math.exp((rfr-contDividendYield) * deltaT);

        double probability = (drift-downSize) / (upSize - downSize);



        System.out.println("deltaT = " + deltaT);
        System.out.println("upSize = " + upSize);
        System.out.println("downSize = " + downSize);
        System.out.println("disc = " + disc);
        System.out.println("drift = " + drift);
        System.out.println("probability = " + probability);

        double[] optionPrices = new double[steps + 1];

        double stockP = stockPrice * Math.pow(downSize, steps);
        for(int i=0; i<=steps; i++) {
            double payoff = intrinsic(totalOptionType.getOptionType(), stockP, strikePrice);
            optionPrices[i] = payoff;
            stockP *= (upSize/downSize);
        }

        for(int i=steps - 1; i>=0; i--) {
            stockP = stockPrice * Math.pow(downSize, i);
            for(int j=0; j<=i; j++) {
                double continuation = disc * (probability * optionPrices[j+1] + (1-probability) * optionPrices[j]);
                if(totalOptionType.getMarketplace().equals(TotalOptionType.Market.American)){
                    double exercise = intrinsic(totalOptionType.getOptionType(), stockP, strikePrice);
                    optionPrices[j] = Math.max(continuation, exercise);
                } else{
                    optionPrices[j] = continuation;
                }
                stockP *= (upSize/downSize);
            }
        }

        System.out.println("optionPrices = " + optionPrices[0]);
       return optionPrices[0];
    }

    private static double intrinsic(OptionType option, double stockP, double strikePrice) {
        return option == OptionType.CALL ? Math.max(0.0, stockP - strikePrice) : Math.max(0.0, strikePrice - stockP);
    }

}
