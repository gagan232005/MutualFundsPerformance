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

    // ---------------------------------------------------------
    // GROQ CONFIGURATION
    // ---------------------------------------------------------

    @Value("${ai.provider:groq}")
    private String provider;

    @Value("${ai.api-key:}")
    private String apiKey;

    @Value("${ai.model:llama-3.3-70b-versatile}")
    private String model;

    @Value("${ai.groq-url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqUrl;

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
                "Fund data (JSON):\n"
                        + contextJson
                        + "\n\n"
                        + "Question:\n"
                        + question;

        try {
            return callGroq(userInput);

        } catch (FundDataException e) {
            throw e;

        } catch (Exception e) {
            throw new FundDataException(
                    "Groq request failed: " + e.getMessage(),
                    e
            );
        }
    }

    // ---------------------------------------------------------
    // GROQ CHAT COMPLETIONS API
    // ---------------------------------------------------------

    private String callGroq(String userInput) throws Exception {

        Map<String, Object> systemMessage = Map.of(
                "role",
                "system",
                "content",
                SYSTEM_PROMPT
        );

        Map<String, Object> userMessage = Map.of(
                "role",
                "user",
                "content",
                userInput
        );

        Map<String, Object> body = Map.of(
                "model",
                model,
                "messages",
                List.of(
                        systemMessage,
                        userMessage
                ),
                "temperature",
                0.2,
                "stream",
                false
        );

        String jsonBody =
                objectMapper.writeValueAsString(body);

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(groqUrl))
                        .timeout(Duration.ofSeconds(60))
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

        // -----------------------------------------------------
        // ERROR HANDLING
        // -----------------------------------------------------

        if (response.statusCode() >= 300) {

            throw new FundDataException(
                    "Groq API error (HTTP "
                            + response.statusCode()
                            + "): "
                            + response.body()
            );
        }

        // -----------------------------------------------------
        // RESPONSE
        // -----------------------------------------------------

        JsonNode root =
                objectMapper.readTree(response.body());

        JsonNode choices =
                root.path("choices");

        if (!choices.isArray() || choices.isEmpty()) {

            throw new FundDataException(
                    "Groq returned no response choices."
            );
        }

        JsonNode message =
                choices.get(0).path("message");

        String answer =
                message.path("content").asText();

        if (answer == null || answer.isBlank()) {

            throw new FundDataException(
                    "Groq returned an empty response."
            );
        }

        return answer.trim();
    }
}