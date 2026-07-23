package com.ammar.bookingsystem.email;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

// Gmail SMTP booking confirmation (FR-5, CLAUDE.md §B.6: service name, date, time, meeting link).
// Never throws — email failure must not break a successful booking (same NFR-4 spirit as the
// Meet-link generation it usually accompanies); callers just don't get a confirmation this time.
@Component
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a");

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingConfirmation(
            String toEmail, String serviceName, LocalDate date, LocalTime startTime, String meetingLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Booking confirmed: " + serviceName);
            StringBuilder body = new StringBuilder();
            body.append("Your booking is confirmed.\n\n");
            body.append("Service: ").append(serviceName).append('\n');
            body.append("Date: ").append(date.format(DATE_FMT)).append('\n');
            body.append("Time: ").append(startTime.format(TIME_FMT)).append('\n');
            if (meetingLink != null) {
                body.append("Meeting link: ").append(meetingLink).append('\n');
            }
            message.setText(body.toString());
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to {} (booking still succeeds)", toEmail, e);
        }
    }

    public void sendProviderBookingNotification(
            String toEmail,
            String serviceName,
            LocalDate date,
            LocalTime startTime,
            String meetingLink,
            String consumerName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("New booking: " + serviceName);
            StringBuilder body = new StringBuilder();
            body.append("You have a new booking.\n\n");
            body.append("Consumer: ").append(consumerName).append('\n');
            body.append("Service: ").append(serviceName).append('\n');
            body.append("Date: ").append(date.format(DATE_FMT)).append('\n');
            body.append("Time: ").append(startTime.format(TIME_FMT)).append('\n');
            if (meetingLink != null) {
                body.append("Meeting link: ").append(meetingLink).append('\n');
            }
            message.setText(body.toString());
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send provider booking notification email to {} (booking still succeeds)", toEmail, e);
        }
    }
}
