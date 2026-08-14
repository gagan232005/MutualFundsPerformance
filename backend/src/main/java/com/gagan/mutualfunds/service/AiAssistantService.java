package com.gagan.mutualfunds.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gagan.mutualfunds.exception.FundDataException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

@Service
public class AiAssistantService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    // ---------------------------------------------------------
    // GEMINI CONFIGURATION
    // ---------------------------------------------------------

    @Value("${ai.provider:gemini}")
    private String provider;

    @Value("${ai.api-key:}")
    private String apiKey;

    @Value("${ai.gemini-model:gemini-3.6-flash}")
    private String geminiModel;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/interactions";

    // ---------------------------------------------------------
    // SYSTEM PROMPT
    // ---------------------------------------------------------

    private static final String SYSTEM_PROMPT = """
            You are an AI assistant embedded in a mutual fund performance dashboard.

            You are given real, freshly-fetched mutual fund NAV statistics,
            model accuracy scores, and NAV forecasts for a specific mutual
            fund scheme.

            Answer the user's question using ONLY the data provided in the
            fund context.

            Be concise, investor-friendly, and specific with numbers where
            relevant, including NAV values, percentages, model names,
            accuracy metrics, and forecast values.

            If the data needed to answer the question is not present,
            say so plainly instead of guessing.

            Never claim guaranteed returns.

            Always describe forecasts as model estimates, not certainties.

            Keep answers to 2-5 sentences unless the user asks for more detail.
            """;

    // ---------------------------------------------------------
    // MAIN METHOD
    // ---------------------------------------------------------

    public String ask(String question, Object fundContext) {

        if (question == null || question.isBlank()) {
            throw new IllegalArgumentException(
                    "Please enter a question for the AI assistant."
            );
        }

        if (apiKey == null || apiKey.isBlank()) {
            throw new FundDataException(
                    "The AI assistant isn't configured yet. " +
                            "Set the AI_API_KEY environment variable."
            );
        }

        String contextJson;

        try {
            contextJson = objectMapper.writeValueAsString(fundContext);
        } catch (Exception e) {
            contextJson = "{}";
        }

        String userInput =
                SYSTEM_PROMPT
                        + "\n\n"
                        + "Fund data (JSON):\n"
                        + contextJson
                        + "\n\n"
                        + "Question: "
                        + question;

        try {
            return callGemini(userInput);

        } catch (FundDataException e) {
            throw e;

        } catch (Exception e) {
            throw new FundDataException(
                    "Gemini request failed: " + e.getMessage(),
                    e
            );
        }
    }

    // ---------------------------------------------------------
    // GEMINI INTERACTIONS API
    // ---------------------------------------------------------

    private String callGemini(String userInput) throws Exception {

        Map<String, Object> body = Map.of(

                "model",
                geminiModel,

                "input",
                userInput
        );

        String jsonBody =
                objectMapper.writeValueAsString(body);

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(GEMINI_URL))
                        .timeout(Duration.ofSeconds(30))

                        .header(
                                "Content-Type",
                                "application/json"
                        )

                        .header(
                                "x-goog-api-key",
                                apiKey
                        )

                        .POST(
                                HttpRequest.BodyPublishers.ofString(
                                        jsonBody
                                )
                        )

                        .build();

        HttpResponse<String> response =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        // -----------------------------------------------------
        // ERROR HANDLING
        // -----------------------------------------------------

        if (response.statusCode() >= 300) {

            throw new FundDataException(
                    "Gemini API error (HTTP "
                            + response.statusCode()
                            + "): "
                            + response.body()
            );
        }

        // -----------------------------------------------------
        // PARSE INTERACTIONS RESPONSE
        // -----------------------------------------------------

        JsonNode root =
                objectMapper.readTree(response.body());

        /*
         * Interactions API response contains:
         *
         * steps -> model_output -> content -> text
         */

        JsonNode steps =
                root.path("steps");

        if (!steps.isArray() || steps.isEmpty()) {

            throw new FundDataException(
                    "Gemini returned no response steps."
            );
        }

        StringBuilder result =
                new StringBuilder();

        for (JsonNode step : steps) {

            String type =
                    step.path("type").asText();

            if (!"model_output".equals(type)) {
                continue;
            }

            JsonNode content =
                    step.path("content");

            if (!content.isArray()) {
                continue;
            }

            for (JsonNode block : content) {

                if ("text".equals(
                        block.path("type").asText()
                )) {

                    String text =
                            block.path("text").asText();

                    if (text != null && !text.isBlank()) {
                        result.append(text);
                    }
                }
            }
        }

        if (result.isEmpty()) {

            throw new FundDataException(
                    "Gemini returned an empty response."
            );
        }

        return result.toString().trim();
    }
}