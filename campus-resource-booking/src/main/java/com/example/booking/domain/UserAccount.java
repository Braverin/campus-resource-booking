package com.example.booking.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 姓名
    private String name;

    // 校园卡号（唯一且必填）
    @Column(name = "campus_card", unique = true, nullable = false)
    private String campusCard;

    // 登录密码
    private String password;

    // 角色（STUDENT / ADMIN）
    private String role;

    //  信用分（允许为 null，但默认 100）
    @Column(name = "credit_score", nullable = false)
    private Integer creditScore = 100;

    // 若数据库里是旧表，确保默认值生效
    @PrePersist
    public void prePersist() {
        if (creditScore == null) {
            creditScore = 100;
        }
    }
}

