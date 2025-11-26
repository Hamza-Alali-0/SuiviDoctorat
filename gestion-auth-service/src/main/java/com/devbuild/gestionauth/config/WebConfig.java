package com.devbuild.gestionauth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploads directory
        // "file:uploads/" assumes the uploads folder is in the working directory of the application
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
