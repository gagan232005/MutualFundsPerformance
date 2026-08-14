import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

export default function AIChat({ data, fundName, onClose }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello. I'm your Fund Intelligence Assistant. I can explain the fund's historical performance, forecasts and model comparison.",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const suggestedQuestions = [
        "How is this fund performing?",
        "Which model gives the best forecast?",
        "Explain the prediction simply",
        "What are the main risks?",
    ];

    function buildContext() {
        if (!data) return {};

        return {
            fundName,
            historicalNAV: data.history || [],
            predictedNAV: data.predicted || [],
            algorithms: data.algorithms || {},
            modelComparison: data.modelComparison || [],
        };
    }

    async function sendMessage(customMessage = null) {
        const question = (customMessage ?? input).trim();

        if (!question || loading) return;

        setInput("");

        const userMessage = {
            role: "user",
            content: question,
        };

        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            /*
             * The backend only exposes POST /ai-assistant, accepting
             * { question, context }. fundName is folded into the
             * context object rather than sent as a separate field.
             */

            const response = await api.post("/ai-assistant", {
                question,
                context: { fundName, ...buildContext() },
            });

            const answer =
                response?.data?.answer ||
                response?.data?.response ||
                response?.data?.message ||
                "I couldn't generate an explanation for that question.";

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: answer,
                },
            ]);
        } catch (error) {
            console.error("AI chat error:", error);

            const backendMessage =
                error?.response?.data?.error ||
                error?.response?.data?.message;

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        backendMessage ||
                        "I couldn't connect to the AI assistant right now. Please check that the backend AI endpoint is running.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        sendMessage();
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="ai-chat-overlay">
            <div
                className="ai-chat-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Fund Intelligence Assistant"
            >
                {/* Header */}
                <div className="ai-chat-header">
                    <div className="ai-chat-brand">
                        <div className="ai-assistant-icon">
                            <svg
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <rect
                                    x="7"
                                    y="9"
                                    width="34"
                                    height="30"
                                    rx="10"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                />

                                <path
                                    d="M16 24C16 19.6 19.6 16 24 16C28.4 16 32 19.6 32 24"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                />

                                <circle cx="19" cy="25" r="2" fill="currentColor" />
                                <circle cx="29" cy="25" r="2" fill="currentColor" />

                                <path
                                    d="M19 31C20.4 32.4 22 33 24 33C26 33 27.6 32.4 29 31"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M24 9V5"
                                    stroke="currentColor"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                />

                                <circle cx="24" cy="4" r="1.8" fill="currentColor" />
                            </svg>
                        </div>

                        <div>
                            <div className="ai-chat-title">
                                Fund Intelligence
                            </div>

                            <div className="ai-chat-subtitle">
                                AI-powered fund analysis
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="ai-chat-close"
                        onClick={onClose}
                        aria-label="Close AI assistant"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M6 6L18 18M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Fund context */}
                <div className="ai-fund-context">
                    <div className="ai-status-dot"></div>

                    <div>
                        <span>ANALYSING</span>
                        <strong>{fundName || "Selected fund"}</strong>
                    </div>
                </div>

                {/* Messages */}
                <div className="ai-chat-messages">
                    {messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`ai-message-row ${
                                message.role === "user"
                                    ? "user-message-row"
                                    : "assistant-message-row"
                            }`}
                        >
                            {message.role === "assistant" && (
                                <div className="ai-mini-icon">
                                    <svg
                                        viewBox="0 0 48 48"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="7"
                                            y="9"
                                            width="34"
                                            height="30"
                                            rx="10"
                                            stroke="currentColor"
                                            strokeWidth="2.4"
                                        />
                                        <circle cx="19" cy="25" r="2" fill="currentColor" />
                                        <circle cx="29" cy="25" r="2" fill="currentColor" />
                                        <path
                                            d="M19 31C20.4 32.4 22 33 24 33C26 33 27.6 32.4 29 31"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            )}

                            <div
                                className={`ai-message ${
                                    message.role === "user"
                                        ? "ai-user-message"
                                        : "ai-assistant-message"
                                }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="ai-message-row assistant-message-row">
                            <div className="ai-mini-icon">
                                <svg
                                    viewBox="0 0 48 48"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="7"
                                        y="9"
                                        width="34"
                                        height="30"
                                        rx="10"
                                        stroke="currentColor"
                                        strokeWidth="2.4"
                                    />
                                    <circle cx="19" cy="25" r="2" fill="currentColor" />
                                    <circle cx="29" cy="25" r="2" fill="currentColor" />
                                </svg>
                            </div>

                            <div className="ai-message ai-assistant-message ai-typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                {messages.length <= 1 && (
                    <div className="ai-suggestions">
                        <div className="ai-suggestions-label">
                            QUICK QUESTIONS
                        </div>

                        <div className="ai-suggestions-grid">
                            {suggestedQuestions.map((question) => (
                                <button
                                    key={question}
                                    type="button"
                                    onClick={() => sendMessage(question)}
                                    disabled={loading}
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <form
                    className="ai-chat-input-area"
                    onSubmit={handleSubmit}
                >
          <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this fund..."
              rows={1}
              disabled={loading}
          />

                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        aria-label="Send message"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 4L20 12L4 20L7 13L15 12L7 11L4 4Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </form>

                <div className="ai-chat-footer">
                    AI-generated insights are informational and not investment advice.
                </div>
            </div>
        </div>
    );
}