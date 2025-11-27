package com.gamegear.gamegear.repository;

import com.gamegear.gamegear.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String userRole);
}
