
package com.example.booking.policy;

import com.example.booking.domain.Booking;

public class SimplePenaltyPolicy implements PenaltyPolicy {
    @Override
    public long calcPenaltyCents(Booking booking, boolean noShow) {
        // 简化：爽约扣 50% 押金；正常完成不扣；超时取消扣 20%（留作扩展）
        if(noShow) return Math.round(booking.getDepositCents() * 0.5);
        return 0L;
    }
}
