package com.gagan.mutualfunds.util;

import com.opencsv.CSVReader;
import org.springframework.stereotype.Component;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

@Component
public class CsvReader {

    public List<String[]> read(String path) throws Exception {
        CSVReader reader = new CSVReader(new FileReader(path));
        List<String[]> rows = new ArrayList<>();

        String[] line;
        while ((line = reader.readNext()) != null) {
            rows.add(line);
        }

        reader.close();
        return rows;
    }
}
