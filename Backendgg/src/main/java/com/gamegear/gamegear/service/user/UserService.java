package com.gamegear.gamegear.service.user;

import com.gamegear.gamegear.dtos.UserDto;
import com.gamegear.gamegear.model.Role;
import com.gamegear.gamegear.model.User;
import com.gamegear.gamegear.repository.AddressRepository;
import com.gamegear.gamegear.repository.RoleRepository;
import com.gamegear.gamegear.repository.UserRepository;
import com.gamegear.gamegear.request.CreateUserRequest;
import com.gamegear.gamegear.request.UserUpdateRequest;
import com.gamegear.gamegear.service.cart.CartService;
import com.gamegear.gamegear.service.order.OrderService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final CartService cartService;
    private final OrderService orderService;
    private final AddressRepository addressRepository;
    private final RoleRepository roleRepository;


    @Override
    public User createUser(CreateUserRequest request) {
        Role userRole = Optional.ofNullable(roleRepository.findByName("ROLE_USER"))
                .orElseThrow(()-> new EntityNotFoundException("Role not found!"));

        return Optional.of(request).filter(user -> !userRepository.existsByEmail(request.getEmail()))
                .map(req -> {
                    User user = new User();
                    user.setFirstName(req.getFirstName());
                    user.setLastName(req.getLastName());
                    user.setEmail(req.getEmail());
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                    user.setRoles(Set.of(userRole));
                    User savedUser = userRepository.save(user);
                    Optional.ofNullable(req.getAddressList()).ifPresent(addressList -> {
                        addressList.forEach(address -> {
                            address.setUser(savedUser);
                            addressRepository.save(address);
                        });
                    });
                    return savedUser;

                }).orElseThrow(() -> new EntityExistsException("User with email " + request.getEmail() + " already exists!"));
    }

    @Override
    public User updateUser(UserUpdateRequest request, Long userId) {
        return userRepository.findById(userId).map(existingUser -> {
            existingUser.setFirstName(request.getFirstName());
            existingUser.setLastName(request.getLastName());
            return userRepository.save(existingUser);
        }).orElseThrow(
                () -> new EntityNotFoundException("User Not Found!"));
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository
                .findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found!"));
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.findById(userId)
                .ifPresentOrElse(userRepository::delete, () -> {
                    throw new EntityExistsException("User not found!");
                });
    }

    @Override
    public UserDto convertToDto(User user){
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public User getAuthenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return Optional.ofNullable(userRepository.findByEmail(email)).orElseThrow(()-> new EntityNotFoundException("Log in required!"));
    }
}
