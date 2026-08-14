package com.gagan.mutualfunds.service;

import org.springframework.stereotype.Service;
import org.apache.commons.math3.stat.regression.OLSMultipleLinearRegression;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.commons.math3.stat.StatUtils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class ARIMAService {

    private double[] lastSeries;

    public void train(String csvPath) throws Exception {
        List<Double> values = new ArrayList<>();
        BufferedReader br = new BufferedReader(new FileReader(csvPath));

        String line;
        br.readLine(); // skip header

        while ((line = br.readLine()) != null) {
            String[] parts = line.split(",");
            double nav = Double.parseDouble(parts[1]); // assumes NAV in column 2
            values.add(nav);
        }

        br.close();

        lastSeries = values.stream().mapToDouble(d -> d).toArray();
    }

    // Simple ARIMA(1,1,1) forecast
    public double forecastNext() {

        if (lastSeries == null || lastSeries.length < 3) {
            return -1;
        }

        double prev = lastSeries[lastSeries.length - 1];
        double prev2 = lastSeries[lastSeries.length - 2];

        // Simple ARIMA(1,1,1) derivative approximation
        double diff = prev - prev2;

        // Forecast next = last + diff
        return prev + diff * 0.8;
    }
}
