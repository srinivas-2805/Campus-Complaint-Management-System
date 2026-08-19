package com.ccms.repository;

import com.ccms.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {

    List<Complaint> findByStudentId(String studentId);

    List<Complaint> findAllByOrderByCreatedAtDesc();

    List<Complaint> findByDepartmentOrderByCreatedAtDesc(String department);
}
