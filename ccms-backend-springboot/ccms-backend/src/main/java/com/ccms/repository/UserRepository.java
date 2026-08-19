package com.ccms.repository;

import com.ccms.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(String role);

    Optional<User> findByIdAndRole(String id, String role);

    List<User> findByDepartmentAndRole(String department, String role);

    Optional<User> findByResetTokenAndResetTokenExpiryGreaterThan(String resetToken, Long now);
}
