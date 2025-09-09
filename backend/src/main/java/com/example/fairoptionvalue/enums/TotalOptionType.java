package com.example.fairoptionvalue.enums;

public class TotalOptionType {
    private OptionType optionType;
    private Market marketplace;

    public enum Market {
        American, European
    }

    public OptionType getOptionType() {
        return optionType;
    }
    public void setOptionType(OptionType optionType) {
        this.optionType = optionType;
    }
    public Market getMarketplace() {
        return marketplace;
    }
    public void setMarketplace(Market marketplace) {
        this.marketplace = marketplace;
    }
}
