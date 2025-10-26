package com.example.booking.service;

import com.example.booking.domain.Booking;
import com.example.booking.domain.ResourceEntity;
import com.example.booking.domain.UserAccount;
import com.example.booking.domain.CreditHistory;
import com.example.booking.dto.BookingResponse;
import com.example.booking.dto.CreateBookingRequest;
import com.example.booking.exception.BizException;
import com.example.booking.policy.PenaltyPolicy;
import com.example.booking.policy.SimplePenaltyPolicy;
import com.example.booking.repo.BookingRepo;
import com.example.booking.repo.ResourceRepo;
import com.example.booking.repo.UserAccountRepository;
import com.example.booking.repo.CreditHistoryRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepo bookingRepo;
    private final ResourceRepo resourceRepo;
    private final UserAccountRepository userAccountRepository;
    private final CreditHistoryRepository creditHistoryRepository;
    private final PenaltyPolicy penaltyPolicy = new SimplePenaltyPolicy();

    public BookingService(
            BookingRepo bookingRepo,
            ResourceRepo resourceRepo,
            UserAccountRepository userAccountRepository,
            CreditHistoryRepository creditHistoryRepository
    ) {
        this.bookingRepo = bookingRepo;
        this.resourceRepo = resourceRepo;
        this.userAccountRepository = userAccountRepository;
        this.creditHistoryRepository = creditHistoryRepository;
    }

    /** 查询我的预约 */
    public List<BookingResponse> myBookings(Long userId) {
        return bookingRepo.findByUserId(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**  DTO 转换，包含资源的信用需求值 */
    private BookingResponse toDto(Booking b) {
        ResourceEntity resource = resourceRepo.findById(b.getResourceId())
                .orElse(null);

        int creditRequired = (resource != null) ? resource.getCreditRequired() : 0;

        return new BookingResponse(
                b.getId(),
                b.getResourceId(),
                b.getUserId(),
                b.getStartTime(),
                b.getEndTime(),
                b.getStatus(),
                b.getDepositCents(),
                b.getPenaltyCents(),
                creditRequired
        );
    }

    /**  创建预约（新增信用值检查） */
    @Transactional
    public BookingResponse create(Long userId, CreateBookingRequest req) {
        if (req.start().isAfter(req.end()))
            throw new BizException("开始时间必须早于结束时间");

        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new BizException("用户不存在"));

        ResourceEntity res = resourceRepo.findById(req.resourceId())
                .orElseThrow(() -> new BizException("资源不存在"));

        //  信用值检查
        Integer userCredit = (user.getCreditScore() == null) ? 0 : user.getCreditScore();
        int required = res.getCreditRequired();
        if (userCredit < required) {
            throw new BizException("信用值不足，无法预约该资源（所需：" + required + "，当前：" + userCredit + "）");
        }

        // 冲突检测
        var conflicts = bookingRepo.findByResourceIdAndEndTimeGreaterThanAndStartTimeLessThan(
                res.getId(), req.start(), req.end());
        if (!conflicts.isEmpty()) throw new BizException("该时段已被占用");

        Booking booking = Booking.builder()
                .userId(user.getId())
                .resourceId(res.getId())
                .startTime(req.start())
                .endTime(req.end())
                .status("NEW")
                .depositCents(req.depositCents())
                .penaltyCents(0L)
                .build();

        bookingRepo.save(booking);
        return toDto(booking);
    }

    /** 取消预约 */
    @Transactional
    public BookingResponse cancel(Long userId, Long bookingId) {
        Booking b = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BizException("预约不存在"));
        if (!b.getUserId().equals(userId))
            throw new BizException("无权取消他人预约");
        if (!"NEW".equals(b.getStatus()))
            throw new BizException("该状态不可取消");

        // 开始前2小时内取消，按迟取消处理
        boolean late = LocalDateTime.now().isAfter(b.getStartTime().minusHours(2));
        if (late) {
            b.setPenaltyCents(Math.max(
                    b.getPenaltyCents(),
                    Math.round(b.getDepositCents() * 0.2)
            ));
        }

        b.setStatus("CANCELLED");
        bookingRepo.save(b);
        return toDto(b);
    }

    /** 完成预约 */
    @Transactional
    public BookingResponse complete(Long operatorUserId, Long bookingId, boolean noShow) {
        Booking b = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BizException("预约不存在"));
        if (!"NEW".equals(b.getStatus()))
            throw new BizException("该状态不可完成");

        long penalty = penaltyPolicy.calcPenaltyCents(b, noShow);
        b.setPenaltyCents(Math.max(b.getPenaltyCents(), penalty));
        b.setStatus("COMPLETED");
        bookingRepo.save(b);

        return toDto(b);
    }

    /** 信用分更新与记录 */
    @Transactional
    public void updateCredit(UserAccount user, Booking booking, int change, String reason) {
        CreditHistory record = new CreditHistory();
        record.setUser(user);
        record.setBooking(booking);
        record.setChangeValue(change);
        record.setReason(reason);
        record.setCreatedAt(LocalDateTime.now());
        creditHistoryRepository.save(record);

        Integer current = user.getCreditScore();
        int base = (current == null ? 100 : current);
        int newCredit = Math.max(base + change, 0);
        user.setCreditScore(newCredit);
        userAccountRepository.save(user);
    }
}
