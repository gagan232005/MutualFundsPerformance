package com.gagan.mutualfunds.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class GlobalCORSConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                                "http://localhost:*",
                                "https://victorious-manifestation-production.up.railway.app",
                                "https://mutualfundsperformanceprediction.up.railway.app",
                                "https://mutualfundsperformanceprediction-production.up.railway.app",
                                "https://mutual-funds-performance-prediction-platform.up.railway.app"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}