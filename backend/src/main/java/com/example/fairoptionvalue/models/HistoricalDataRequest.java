package com.example.fairoptionvalue.models;

public class HistoricalDataRequest
{
private String stockTicker;
private int multiplier;
private String timespan;
private String fromDate;
private String toDate;
public String getStockTicker()
{
    return stockTicker;
}
public void setStockTicker(String stockTicker)
{
    this.stockTicker = stockTicker;
}
public int getMultiplier()
{
    return multiplier;
}
public void setMultiplier(int multiplier)
{
    this.multiplier = multiplier;
}
public String getTimespan()
{
    return timespan;
}
public void setTimespan(String timespan)
{
    this.timespan = timespan;
}
public String getFromDate()
{
    return fromDate;
}
public void setFromDate(String fromDate)
{
    this.fromDate = fromDate;
}
public String getToDate()
{
    return toDate;
}
public void setToDate(String toDate)
{
    this.toDate = toDate;
}
}
