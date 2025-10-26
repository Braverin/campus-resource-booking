package com.example.booking.controller;

import com.example.booking.domain.UserAccount;
import com.example.booking.exception.BizException;
import com.example.booking.repo.UserAccountRepository;
import com.example.booking.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin // 允许前端跨域访问
public class AuthController {

    private final AuthService authService;
    private final UserAccountRepository userRepo;

    public AuthController(AuthService authService, UserAccountRepository userRepo) {
        this.authService = authService;
        this.userRepo = userRepo;
    }

    /**
     *  用户登录接口
     * 前端传入 JSON：
     * {
     *   "campusCard": "123456",
     *   "password": "abcdef"
     * }
     * 返回：
     * {
     *   "success": true,
     *   "id": 1,
     *   "name": "张三",
     *   "role": "STUDENT",
     *   "campusCard": "123456",
     *   "creditScore": 100
     * }
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String campusCard = request.get("campusCard");
        String password = request.get("password");

        // 调用认证逻辑
        Optional<UserAccount> userOpt = authService.login(campusCard, password);

        // 登录失败
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "卡号或密码错误");
            return error;
        }

        // 登录成功
        UserAccount user = userOpt.get();

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("id", user.getId());
        result.put("role", user.getRole());
        result.put("name", user.getName());
        result.put("campusCard", user.getCampusCard());
        result.put("creditScore", user.getCreditScore());
        //  不返回密码以确保安全
        return result;
    }

    /**
     *  新增：获取当前登录用户信息接口
     * 前端通过请求头 X-User-Id 发送用户ID
     * 返回：
     * {
     *   "campusCard": "123456",
     *   "name": "张三",
     *   "role": "ADMIN",
     *   "password": "abcdef",
     *   "creditScore": 80
     * }
     */
    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        UserAccount user = userRepo.findById(userId)
                .orElseThrow(() -> new BizException("用户不存在"));

        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("campusCard", user.getCampusCard());
        info.put("name", user.getName());
        info.put("role", user.getRole().toUpperCase());
        info.put("password", user.getPassword()); //  用于 MyInfo.jsx 的可见/隐藏切换
        info.put("creditScore", user.getCreditScore());
        return info;
    }
}

