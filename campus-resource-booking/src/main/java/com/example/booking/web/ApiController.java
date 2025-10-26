
package com.example.booking.web;

import com.example.booking.dto.BookingResponse;
import com.example.booking.dto.CreateBookingRequest;
import com.example.booking.exception.BizException;
import com.example.booking.repo.ResourceRepo;
import com.example.booking.repo.UserRepo;
import com.example.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ResourceRepo resourceRepo;
    private final BookingService bookingService;
    private final UserRepo userRepo;

    public ApiController(ResourceRepo resourceRepo, BookingService bookingService, UserRepo userRepo) {
        this.resourceRepo = resourceRepo;
        this.bookingService = bookingService;
        this.userRepo = userRepo;
    }

    @GetMapping("/resources")
    public Object resources(){
        return resourceRepo.findAll();
    }

    @PostMapping("/resources")
    public Object createResource(@RequestHeader("X-User-Id") Long userId, @RequestBody Map<String,Object> body){
        var user = userRepo.findById(userId).orElseThrow(() -> new BizException("用户不存在"));
        if(!"ADMIN".equals(user.getRole())) throw new BizException("需要管理员权限");
        var res = com.example.booking.domain.ResourceEntity.builder()
                .name((String) body.get("name"))
                .type((String) body.get("type"))
                .capacity(((Number) body.getOrDefault("capacity", 1)).intValue())
                .build();
        return resourceRepo.save(res);
    }

    @GetMapping("/bookings")
    public Object myBookings(@RequestHeader("X-User-Id") Long userId){
        return bookingService.myBookings(userId);
    }

    @PostMapping("/bookings")
    public BookingResponse createBooking(@RequestHeader("X-User-Id") Long userId,
                                         @Valid @RequestBody CreateBookingRequest req){
        return bookingService.create(userId, req);
    }

    @PostMapping("/bookings/{id}/cancel")
    public BookingResponse cancel(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id){
        return bookingService.cancel(userId, id);
    }

    @PostMapping("/bookings/{id}/complete")
    public BookingResponse complete(@RequestHeader("X-User-Id") Long userId, @PathVariable Long id,
                                    @RequestParam(defaultValue = "false") boolean noShow){
        // 简化：管理员或本人都可完成
        return bookingService.complete(userId, id, noShow);
    }
}
