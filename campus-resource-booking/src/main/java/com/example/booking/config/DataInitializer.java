package com.example.booking.config;

import com.example.booking.domain.ResourceEntity;
import com.example.booking.domain.UserAccount;
import com.example.booking.repo.ResourceRepo;
import com.example.booking.repo.UserAccountRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;

/**
 * 启动时自动建表 + 导入初始资源数据 + 创建管理员账户
 */
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserAccountRepository userRepo, ResourceRepo resourceRepo) {
        return args -> {
            // 1⃣ 确保自动建表（依赖 JPA ddl-auto）

            // 2⃣ 导入 resources.json 数据（仅当资源表为空时）
            if (resourceRepo.count() == 0) {
                try (InputStream is = getClass().getResourceAsStream("/init-data/resources.json")) {
                    ObjectMapper mapper = new ObjectMapper();
                    List<ResourceEntity> resources = mapper.readValue(is, new TypeReference<>() {});
                    resourceRepo.saveAll(resources);
                    System.out.println(" 已自动导入初始资源数据，共 " + resources.size() + " 条");
                } catch (Exception e) {
                    System.err.println(" 导入资源数据失败: " + e.getMessage());
                }
            }

            // 3⃣ 创建默认管理员
            boolean adminExists = userRepo.findAll().stream()
                    .anyMatch(u -> "ADMIN".equalsIgnoreCase(u.getRole()));

            if (!adminExists) {
                UserAccount admin = new UserAccount();
                admin.setName("系统管理员");
                admin.setCampusCard("admin");
                admin.setPassword("admin123");
                admin.setRole("ADMIN");
                admin.setCreditScore(100);
                userRepo.save(admin);
                System.out.println(" 已创建管理员账户：admin / admin123");
            }
        };
    }
}

