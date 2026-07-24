package com.ammar.bookingsystem.booking.dto;

import java.time.LocalDate;
import java.util.List;

// "Bookings over time" line chart: one bucket per day/week/month across the [from,to] range,
// respecting the shared service/status/provider filters. label is the display tick; date is the
// bucket's start; count is how many bookings fell in it.
public record ChartResponse(List<Bucket> buckets) {
    public record Bucket(String label, LocalDate date, long count) {}
}
