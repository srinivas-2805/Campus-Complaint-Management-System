package com.ccms.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Replaces the @sendgrid/mail (auth.controller.js) and nodemailer (complaint.controller.js)
 * usage from the Node backend with a single Spring Mail based sender.
 *
 * Configure spring.mail.* (or MAIL_HOST/EMAIL_USER/EMAIL_PASS env vars) to point at your
 * SMTP provider. Failures are logged and swallowed, matching the original try/catch-and-log
 * behavior around each sgMail.send(...) call so a broken mail provider never blocks the
 * underlying complaint/auth operation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.mail.from-address}")
    private String fromAddress;

    public void sendHtml(String to, String subject, String html) {
        sendHtml(List.of(to), subject, html);
    }

    public void sendHtml(List<String> to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromAddress, fromName);
            helper.setTo(to.toArray(new String[0]));
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException | RuntimeException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
