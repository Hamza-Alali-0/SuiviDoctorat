package com.devbuild.soutenance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SoutenanceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SoutenanceApplication.class, args);
    }
}
