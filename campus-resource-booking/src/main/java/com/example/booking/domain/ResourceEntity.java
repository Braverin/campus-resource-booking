
package com.example.booking.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "resources")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResourceEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type; // ROOM/LAB/DEVICE
    private int capacity;

    @Version
    private Long version; // 乐观锁

    @Column(nullable = false)
    @Builder.Default
    private boolean available = true;

    @Column(nullable = false)
    @Builder.Default
    private int creditRequired = 20;
}
