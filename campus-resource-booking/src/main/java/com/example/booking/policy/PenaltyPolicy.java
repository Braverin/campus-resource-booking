
package com.example.booking.policy;

import com.example.booking.domain.Booking;

public interface PenaltyPolicy {
    long calcPenaltyCents(Booking booking, boolean noShow);
}
