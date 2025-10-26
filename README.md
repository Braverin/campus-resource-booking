#  校园场地与设备预约系统（Java + React）

**技术栈**：Spring Boot 3 + Java 17 + JPA + MySQL + React + TailwindCSS  
**架构要点**：
- 分层设计（Controller / Service / Domain / Repository）
- 策略模式（信用值扣罚 / 惩罚策略）
- 模板方法（预约流程复用）
- 乐观锁（避免并发超卖）
- 自动数据初始化（首次启动自动建表与导入资源）

---

##  快速运行
前后端已整合，可以直接spring-boot:run直接启动前后端

###  后端（Spring Boot）

```bash
# 方式一：IDEA 或 VS Code 直接运行 Application.main()
# 方式二：命令行运行
mvn spring-boot:run
# 或
mvn -q -DskipTests package && java -jar target/campus-resource-booking-0.1.0.jar


###  前端（React）

```bash
cd frontend
npm install
npm run dev
```

访问地址：
- 后端接口：`http://localhost:8080`
- 前端页面：`http://localhost:5173`

---

##  ️ 数据库配置

在 `src/main/resources/application.yml` 中配置你自己的 MySQL：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/campus_resource_booking?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: ${DB_USERNAME:root}         # 这里写你的 MySQL 用户名
    password: ${DB_PASSWORD:123456}       # 这里写你的 MySQL 密码
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update     # 自动建表 (开发推荐 update，生产推荐 validate)
    show-sql: true         # 控制台打印 SQL
    properties:
      hibernate:
        format_sql: true
    database-platform: org.hibernate.dialect.MySQL8Dialect

server:
  port: 8080               # 运行端口，默认 8080，不冲突就不用改
```

>  项目启动时 JPA 会自动在数据库中创建表结构，无需执行 SQL 文件。

---

##  自动初始化功能

系统启动时自动执行以下操作（由 `DataInitializer.java` 实现）：

1.  **自动创建表结构**  
   根据实体类自动建表（`UserAccount`, `ResourceEntity`, `Booking`, `CreditHistory` 等）。

2.  **自动导入初始资源数据**  
   从 `/resources/init-data/resources.json` 文件中读取并写入数据库。

3.  **自动创建管理员账户**  
   若数据库中不存在管理员，则自动生成：
   ```
   用户名：admin
   密码：admin123
   角色：ADMIN
   ```

启动后控制台会输出：
```
 已自动导入初始资源数据，共 X 条
 已创建管理员账户：admin / admin123
```

---

##  关键接口（HTTP API）

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/resources` | 查询资源列表 |
| `POST` | `/api/resources` | 创建资源（管理员） |
| `GET` | `/api/bookings` | 查询当前用户的预约记录 |
| `POST` | `/api/bookings` | 创建预约 |
| `POST` | `/api/bookings/{id}/cancel` | 取消预约 |
| `POST` | `/api/bookings/{id}/complete` | 完成预约（含信用值变动） |
| `GET` | `/api/auth/me` | 获取当前用户信息 |
| `POST` | `/api/auth/login` | 登录 |

> 登录成功后系统自动携带 `X-User-Id` 请求头，后端可识别当前用户。

---

##  系统结构

- **后端**
    - `controller`：暴露接口层
    - `service`：业务逻辑层（含信用分扣罚逻辑）
    - `domain`：实体与业务模型
    - `repo`：JPA 数据访问层
    - `config`：初始化与全局配置
- **前端**
    - `LoginForm.jsx`：登录页面
    - `ResourceList.jsx`：资源展示
    - `BookingForm.jsx`：预约创建
    - `MyBookings.jsx`：我的预约
    - `MyInfo.jsx`：个人信息
    - `AdminResource.jsx`：管理员页面（仅 ADMIN 可见）

---

##  默认账户与数据

| 角色 | 卡号 | 密码 | 说明 |
|------|------|------|------|
| 管理员 | admin | admin123 | 拥有资源管理权限 |
| 普通用户 | 用户自行注册或数据库添加 | - | 可进行预约操作 |

---

##  UML 文档（可选）

系统 UML 图位于：
```
docs/uml/
```

包含：
- 用例图：`usecase.puml`
- 顺序图：`sequence_booking.puml`
- 类图：`class_model.puml`

可使用 VS Code + PlantUML 插件或 [PlantText](https://www.planttext.com/) 在线查看。

---

##  实验报告建议

在报告中可展示：
- 系统架构图（Controller / Service / Repository）
- UML 类图、顺序图
- 关键业务流程：资源预约、信用扣分策略
- 数据库表结构与 ER 图
- 系统运行截图（管理员登录、资源展示、预约流程）

---

##  项目特性总结

-  **一键运行，无需导入 SQL**
-  **自动初始化数据**
-  **基于角色的访问控制**
-  **信用值系统（动态变动）**
-  **可扩展的业务策略模式**
-  **完善的前后端架构分层**

---

## 开发者

> 开发者：邓翔允  
> 项目版本：v1.0  
> 日期：2025.10.26

---

##  启动成功效果示例

```
 已自动导入初始资源数据，共 3 条
 已创建管理员账户：admin / admin123
Spring Boot started on port(s): 8080
```

访问：
- 管理员登录页 → 输入 admin / admin123
- 登录成功后自动进入管理员界面（资源管理、信用值查看、预约管理等）
```



