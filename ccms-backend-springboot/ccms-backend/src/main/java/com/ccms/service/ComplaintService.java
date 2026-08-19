package com.ccms.service;

import com.ccms.dto.ComplaintResponseDto;
import com.ccms.dto.CreateComplaintRequest;
import com.ccms.dto.FacultyUpdateComplaintRequest;
import com.ccms.dto.UpdateStatusRequest;
import com.ccms.exception.ApiException;
import com.ccms.model.Complaint;
import com.ccms.model.User;
import com.ccms.repository.ComplaintRepository;
import com.ccms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

/**
 * Mirrors server/controllers/complaint.controller.js (the active, uncommented code at the
 * bottom of that file). Role checks are kept identical to the original, including the
 * pre-existing quirk noted below.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ComplaintResponseDto createComplaint(User requester, CreateComplaintRequest request) {
        // NOTE: Complaint.builder() applies @Builder.Default only when a field is left
        // unset; explicitly passing null would override the "General"/"low" defaults with
        // null, so we replicate Mongoose's schema-default behavior here explicitly.
        Complaint.ComplaintBuilder builder = Complaint.builder()
                .title(request.title())
                .description(request.description())
                .studentId(requester.getId());
        if (request.department() != null) {
            builder.department(request.department());
        }
        if (request.urgency() != null) {
            builder.urgency(request.urgency());
        }
        Complaint complaint = builder.build();

        Complaint saved = complaintRepository.save(complaint);

        // Notify department faculty (using the resolved department/urgency, i.e. after defaults applied)
        List<User> faculties = userRepository.findByDepartmentAndRole(saved.getDepartment(), "faculty");
        if (!faculties.isEmpty()) {
            List<String> facultyEmails = faculties.stream().map(User::getEmail).toList();
            String html = """
                    <h2>New Complaint Submitted</h2>
                    <p><strong>Title:</strong> %s</p>
                    <p><strong>Description:</strong> %s</p>
                    <p><strong>Urgency:</strong> %s</p>
                    <p><strong>Submitted by:</strong> %s (%s)</p>
                    <p><small>Complaint ID: %s</small></p>
                    """.formatted(saved.getTitle(), saved.getDescription(), saved.getUrgency(),
                    requester.getName(), requester.getEmail(), saved.getId());
            emailService.sendHtml(facultyEmails, "New Complaint in " + saved.getDepartment() + " Department", html);
        }

        // Confirmation email to student
        String confirmationHtml = """
                <h2>Complaint Submitted</h2>
                <p>Dear %s,</p>
                <p>Your complaint has been successfully submitted with the following details:</p>
                <p><strong>Title:</strong> %s</p>
                <p><strong>Description:</strong> %s</p>
                <p><strong>Department:</strong> %s</p>
                <p><strong>Urgency:</strong> %s</p>
                <p>Thank you for bringing this to our attention.</p>
                """.formatted(requester.getName(), saved.getTitle(), saved.getDescription(),
                saved.getDepartment(), saved.getUrgency());
        emailService.sendHtml(requester.getEmail(), "Complaint Submitted Successfully", confirmationHtml);

        return toDto(saved, requester);
    }

    // GET /api/complaints -> getAllComplaints in Node: only "admin" or "staff" roles pass.
    // NOTE: this app's role enum is student/faculty/admin - "staff" never actually exists,
    // so (as in the original) this endpoint is effectively admin-only today. Kept as-is
    // for parity; widen to include "faculty" if that was the intended behavior.
    private static final Set<String> ALL_COMPLAINTS_ROLES = Set.of("admin", "staff");

    public List<ComplaintResponseDto> getAllComplaints(User requester) {
        if (!ALL_COMPLAINTS_ROLES.contains(requester.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return complaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(c -> toDto(c, resolveStudent(c)))
                .toList();
    }

    public List<ComplaintResponseDto> getMyComplaints(User requester) {
        return complaintRepository.findByStudentId(requester.getId()).stream()
                .map(c -> toDto(c, requester))
                .toList();
    }

    public ComplaintResponseDto updateStatus(User requester, String id, UpdateStatusRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Complaint not found"));

        boolean sameDepartment = complaint.getDepartment() != null
                && complaint.getDepartment().equals(requester.getDepartment());
        if (!"admin".equals(requester.getRole()) && !sameDepartment) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }

        complaint.setStatus(request.status());
        Complaint saved = complaintRepository.save(complaint);
        User student = resolveStudent(saved);

        if (student != null) {
            String html = """
                    <p>Hi %s,</p>
                    <p>The status of your complaint "<strong>%s</strong>" has been updated.</p>
                    <p><strong>New Status:</strong> %s</p>
                    <p>Please check your dashboard for details.</p>
                    """.formatted(student.getName(), saved.getTitle(), saved.getStatus());
            emailService.sendHtml(student.getEmail(), "Complaint Status Updated", html);
        }

        return toDto(saved, student);
    }

    public List<ComplaintResponseDto> getDepartmentComplaints(User requester) {
        if (!"faculty".equals(requester.getRole())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return complaintRepository.findByDepartmentOrderByCreatedAtDesc(requester.getDepartment()).stream()
                .map(c -> toDto(c, resolveStudent(c)))
                .toList();
    }

    public ComplaintResponseDto updateComplaintByFaculty(User requester, String id, FacultyUpdateComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Complaint not found"));

        boolean sameDepartment = complaint.getDepartment() != null
                && complaint.getDepartment().equals(requester.getDepartment());
        if (!"faculty".equals(requester.getRole()) || !sameDepartment) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (request.status() != null && !request.status().isBlank()) {
            complaint.setStatus(request.status());
        }
        if (request.progress() != null && !request.progress().isBlank()) {
            complaint.setProgress(request.progress());
        }

        Complaint saved = complaintRepository.save(complaint);
        User student = resolveStudent(saved);

        if (student != null) {
            String html = """
                    <p>Hi %s,</p>
                    <p>Your complaint "<strong>%s</strong>" has been updated by faculty.</p>
                    %s
                    %s
                    <p>Check your dashboard for details.</p>
                    """.formatted(
                    student.getName(),
                    saved.getTitle(),
                    request.status() != null && !request.status().isBlank()
                            ? "<p><strong>Status:</strong> " + request.status() + "</p>" : "",
                    request.progress() != null && !request.progress().isBlank()
                            ? "<p><strong>Progress:</strong> " + request.progress() + "</p>" : ""
            );
            emailService.sendHtml(student.getEmail(), "Complaint Update Notification", html);
        }

        return toDto(saved, student);
    }

    public void deleteComplaint(User requester, String id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Complaint not found"));

        boolean ownsComplaint = complaint.getStudentId() != null && complaint.getStudentId().equals(requester.getId());
        if ("student".equals(requester.getRole()) && !ownsComplaint) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Unauthorized");
        }

        complaintRepository.delete(complaint);
    }

    private User resolveStudent(Complaint complaint) {
        if (complaint.getStudentId() == null) return null;
        return userRepository.findById(complaint.getStudentId()).orElse(null);
    }

    private ComplaintResponseDto toDto(Complaint complaint, User student) {
        return ComplaintResponseDto.from(complaint, student);
    }
}
