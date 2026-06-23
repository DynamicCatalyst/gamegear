package com.gamegear.gamegear.controller;

import com.gamegear.gamegear.dtos.AddressDto;
import com.gamegear.gamegear.model.Address;
import com.gamegear.gamegear.response.ApiResponse;
import com.gamegear.gamegear.service.address.IAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/addresses")
public class AddressController {

    private final IAddressService addressService;

    @PostMapping("/{userId}/new")
    public ResponseEntity<ApiResponse> createAddresses(@RequestBody List<Address> addresses,@PathVariable Long userId) {
        List<Address> addressList = addressService.createAddress(addresses, userId);
        List<AddressDto> addressDto = addressService.convertToDto(addressList);
        return ResponseEntity.ok(new ApiResponse("Success!", addressDto));
    }

    @GetMapping("/{userId}/address")
    public ResponseEntity<ApiResponse> getUserAddresses(@PathVariable Long userId) {
        List<Address> addressList = addressService.getUserAddresses(userId);
        List<AddressDto> addressDto = addressService.convertToDto(addressList);
        return ResponseEntity.ok(new ApiResponse("Found!", addressDto));
    }

    @GetMapping("/{id}/address")
    public ResponseEntity<ApiResponse> getAddressById(@PathVariable Long id) {
        Address address = addressService.getAddressById(id);
        AddressDto addressDto = addressService.convertToDto(address);
        return ResponseEntity.ok(new ApiResponse("Found!", addressDto));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<ApiResponse> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        Address updatedAddress = addressService.updateAddress(id, address);
        AddressDto addressDto = addressService.convertToDto(updatedAddress);
        return ResponseEntity.ok(new ApiResponse("Success!", addressDto));
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(new ApiResponse("Address deleted", null));
    }
}

