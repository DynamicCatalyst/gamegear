package com.gamegear.gamegear.dtos;

import com.gamegear.gamegear.model.Cart;
import com.gamegear.gamegear.model.OrderItemDto;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private List<OrderDto> orders;
    private CartDto cart;
    private List<AddressDto> addressList;
}
