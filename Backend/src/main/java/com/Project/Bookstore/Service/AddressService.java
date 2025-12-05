package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Address;
import com.Project.Bookstore.Repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {
    private final AddressRepository addressRepository;
    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }
    public List<Address> findAll() {
        return this.addressRepository.findAll();
    }
    public Address findById(Integer id) {
        return this.addressRepository.findById(id).orElse(null);
    }
    public void deleteById(Integer id) {
        this.addressRepository.deleteById(id);
    }
    public Address saveAddress(Address address) {
        return this.addressRepository.save(address);
    }
}
