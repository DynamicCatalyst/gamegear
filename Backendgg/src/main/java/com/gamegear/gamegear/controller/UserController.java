package com.gamegear.gamegear.controller;

import com.gamegear.gamegear.dtos.UserDto;
import com.gamegear.gamegear.model.User;
import com.gamegear.gamegear.request.CreateUserRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import com.gamegear.gamegear.request.UserUpdateRequest;
import com.gamegear.gamegear.response.ApiResponse;
import com.gamegear.gamegear.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final IUserService userService;

    @GetMapping("/user/{userId}/user")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new ApiResponse("Found!", userDto));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add-admin")
    public ResponseEntity<ApiResponse> createAdmin(@RequestBody CreateUserRequest request) {
        User user = userService.createAdmin(request);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new ApiResponse("Admin created successfully!", userDto));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new ApiResponse("Created User Successfully!", userDto));
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<ApiResponse> updateUser(@RequestBody UserUpdateRequest request, @PathVariable Long userId) {
        User user = userService.updateUser(request, userId);
        UserDto userDto = userService.convertToDto(user);
        return ResponseEntity.ok(new ApiResponse("Updated User Successfully!", userDto));
    }

    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(new ApiResponse("Deleted User Successfully!", null));
    }

}
