package com.gamegear.gamegear.service.user;

import com.gamegear.gamegear.dtos.UserDto;
import com.gamegear.gamegear.model.User;
import com.gamegear.gamegear.request.CreateUserRequest;
import com.gamegear.gamegear.request.UserUpdateRequest;

public interface IUserService {
    User createUser(CreateUserRequest request);
    User updateUser(UserUpdateRequest request, Long userId);
    User getUserById(Long userId);
    void deleteUser(Long userId);

    UserDto convertToDto(User user);

    User getAuthenticatedUser();
}
