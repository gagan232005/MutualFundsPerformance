package com.gagan.mutualfunds.service;

import org.springframework.stereotype.Service;
import weka.classifiers.trees.RandomForest;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;
import weka.core.converters.CSVLoader;

import java.io.File;

@Service
public class RandomForestService {

    private static final String MODEL_FILE = "models/rf.model";
    private static final String HEADER_FILE = "models/rf-header.model";

    private RandomForest model;
    private Instances header;

    public void train(String csvPath) throws Exception {

        CSVLoader loader = new CSVLoader();
        loader.setSource(new File(csvPath));
        Instances data = loader.getDataSet();
        data.setClassIndex(data.numAttributes() - 1);

        RandomForest rf = new RandomForest();
        rf.buildClassifier(data);

        new File("models").mkdirs();
        SerializationHelper.write(MODEL_FILE, rf);
        SerializationHelper.write(HEADER_FILE, new Instances(data, 0));

        this.model = rf;
        this.header = new Instances(data, 0);
    }

    public double predict(double[] features) throws Exception {
        loadIfNeeded();

        Instance inst = new weka.core.DenseInstance(header.numAttributes());
        inst.setDataset(header);

        for (int i = 0; i < features.length; i++) {
            inst.setValue(i, features[i]);
        }

        inst.setMissing(header.classIndex());

        return model.classifyInstance(inst);
    }

    private void loadIfNeeded() throws Exception {
        if (model == null) {
            model = (RandomForest) SerializationHelper.read(MODEL_FILE);
            header = (Instances) SerializationHelper.read(HEADER_FILE);
        }
    }
}
