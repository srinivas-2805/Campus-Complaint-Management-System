package com.ccms.controller;

import com.ccms.dto.ComplaintResponseDto;
import com.ccms.dto.CreateComplaintRequest;
import com.ccms.dto.FacultyUpdateComplaintRequest;
import com.ccms.dto.UpdateStatusRequest;
import com.ccms.security.UserPrincipal;
import com.ccms.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Mirrors server/routes/complaintRoutes.js.
 */
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponseDto> createComplaint(@AuthenticationPrincipal UserPrincipal principal,
                                                                  @RequestBody CreateComplaintRequest request) {
        ComplaintResponseDto complaint = complaintService.createComplaint(principal.getUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ComplaintResponseDto>> getMyComplaints(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(complaintService.getMyComplaints(principal.getUser()));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponseDto>> getAllComplaints(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(complaintService.getAllComplaints(principal.getUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComplaintResponseDto> updateStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                               @PathVariable String id,
                                                               @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(complaintService.updateStatus(principal.getUser(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteComplaint(@AuthenticationPrincipal UserPrincipal principal,
                                                                 @PathVariable String id) {
        complaintService.deleteComplaint(principal.getUser(), id);
        return ResponseEntity.ok(Map.of("message", "Complaint deleted successfully"));
    }

    @GetMapping("/department")
    public ResponseEntity<List<ComplaintResponseDto>> getDepartmentComplaints(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(complaintService.getDepartmentComplaints(principal.getUser()));
    }

    @PutMapping("/faculty-update/{id}")
    public ResponseEntity<ComplaintResponseDto> updateComplaintByFaculty(@AuthenticationPrincipal UserPrincipal principal,
                                                                          @PathVariable String id,
                                                                          @RequestBody FacultyUpdateComplaintRequest request) {
        return ResponseEntity.ok(complaintService.updateComplaintByFaculty(principal.getUser(), id, request));
    }
}
