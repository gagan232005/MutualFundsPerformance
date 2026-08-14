package com.gagan.mutualfunds.util;

public class Metrics {

    public static double mse(double[] actual, double[] predicted) {
        double sum = 0;
        for (int i = 0; i < actual.length; i++) {
            sum += Math.pow(actual[i] - predicted[i], 2);
        }
        return sum / actual.length;
    }

    public static double mae(double[] actual, double[] predicted) {
        double sum = 0;
        for (int i = 0; i < actual.length; i++) {
            sum += Math.abs(actual[i] - predicted[i]);
        }
        return sum / actual.length;
    }
}
