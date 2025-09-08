package com.example.fairoptionvalue.service;

import com.example.fairoptionvalue.enums.OptionType;
import com.example.fairoptionvalue.models.FedRateData;
import com.example.fairoptionvalue.models.HistoricalDataRequest;
import com.example.fairoptionvalue.models.StockResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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


    public double GetVolatility() {

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

        return Math.sqrt(standardDev / lengthClose);
    }

    public double GetNormalDistribution(double meanClose, double standardDeviation, double Zscore) {
        NormalDistribution normal = new NormalDistribution(meanClose, standardDeviation);
        return normal.cumulativeProbability(Zscore);
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
                                          double dTE, double meanClose, double standardDev) {

        if (optionType == OptionType.CALL) {
            double d1 = (Math.log(stockPrice / strikePrice) + (rfr + Math.pow(standardDev, 2) / 2) * timeToExp) / standardDev * Math.sqrt(timeToExp);
            double d2 = d1 - standardDev * Math.sqrt(timeToExp);

            double CallValue = stockPrice * GetNormalDistribution(meanClose, standardDev, d1) - strikePrice *
                    Math.pow(Math.E, -rfr * timeToExp) * GetNormalDistribution(meanClose, standardDev, d2);

            double PutValue = strikePrice * Math.pow(Math.E, -rfr * timeToExp) * GetNormalDistribution(meanClose, standardDev, -d2)
                    - stockPrice * GetNormalDistribution(meanClose, standardDev, -d1);


        }
        if (optionType == OptionType.PUT) {

        }

        return 0;
    }


}
