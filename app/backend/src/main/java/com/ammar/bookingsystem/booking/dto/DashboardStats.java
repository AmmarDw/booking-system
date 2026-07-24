package com.ammar.bookingsystem.booking.dto;

// Dashboard stat cards, all computed over the caller-supplied [from,to] range (the date-range
// filter fully drives these — no fixed today/this-week/30d windows) and narrowed by the shared
// service/provider filters. The status filter deliberately does NOT apply here: each card has an
// intrinsic status meaning (a no-show rate needs completed+no_show regardless of what's filtered).
public record DashboardStats(
        long bookingsOnStartDate, long confirmedInRange, long cancelledInRange, int noShowRatePercent) {}
