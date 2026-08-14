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
import java.util.List;
import java.util.Map;

@Service
public class AiAssistantService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${ai.provider:grok}")
    private String provider;

    @Value("${ai.api-key:}")
    private String apiKey;

    @Value("${ai.model:grok-3-mini}")
    private String model;

    @Value("${ai.grok-url:https://api.x.ai/v1/chat/completions}")
    private String grokUrl;

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
            if ("grok".equalsIgnoreCase(provider)) {
                return callGrok(userInput);
            }

            throw new FundDataException(
                    "Unsupported AI provider: " + provider
            );

        } catch (FundDataException e) {
            throw e;

        } catch (Exception e) {
            throw new FundDataException(
                    "Grok request failed: " + e.getMessage(),
                    e
            );
        }
    }

    private String callGrok(String userInput) throws Exception {

        Map<String, Object> systemMessage = Map.of(
                "role", "system",
                "content", SYSTEM_PROMPT
        );

        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content",
                "Fund data (JSON):\n"
                        + userInput
        );

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        systemMessage,
                        userMessage
                )
        );

        String jsonBody =
                objectMapper.writeValueAsString(body);

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(grokUrl))
                        .timeout(Duration.ofSeconds(30))
                        .header(
                                "Content-Type",
                                "application/json"
                        )
                        .header(
                                "Authorization",
                                "Bearer " + apiKey
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

        if (response.statusCode() >= 300) {

            throw new FundDataException(
                    "Grok API error (HTTP "
                            + response.statusCode()
                            + "): "
                            + response.body()
            );
        }

        JsonNode root =
                objectMapper.readTree(response.body());

        JsonNode choices =
                root.path("choices");

        if (!choices.isArray() || choices.isEmpty()) {
            throw new FundDataException(
                    "Grok returned no response choices."
            );
        }

        String result =
                choices
                        .get(0)
                        .path("message")
                        .path("content")
                        .asText();

        if (result == null || result.isBlank()) {
            throw new FundDataException(
                    "Grok returned an empty response."
            );
        }

        return result.trim();
    }
}