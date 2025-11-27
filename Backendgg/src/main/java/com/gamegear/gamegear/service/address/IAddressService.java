package com.gamegear.gamegear.service.address;

import com.gamegear.gamegear.dtos.AddressDto;
import com.gamegear.gamegear.model.Address;
import java.util.List;

public interface IAddressService {
    List<Address>  createAddress(List<Address> addressList , Long userId);
    List<Address> getUserAddresses(Long userId);
    Address getAddressById(Long addressId);
    void deleteAddress(Long addressId);
    Address updateAddress(Long id, Address address);

    List<AddressDto> convertToDto(List<Address> addressList);

    AddressDto convertToDto(Address address);
}
