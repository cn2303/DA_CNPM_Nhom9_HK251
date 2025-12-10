package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Address;
import com.Project.Bookstore.Model.User;
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
        return this.addressRepository.findById(id).orElseThrow(()-> new RuntimeException("No Address Found ID: " + id));
    }
    public void deleteById(Integer id) {
        if(!addressRepository.existsById(id)) {
            throw new RuntimeException("No Address Found ID: " + id);
        }
        this.addressRepository.deleteById(id);
    }
    public List<Address> findByUserId(Integer id) {
        return this.addressRepository.findByUserId(id);
    }
    public Address saveAddress(Address address) {
        if(address.getId() != null)
            throw new RuntimeException("Address ID must be null");
        return this.addressRepository.save(address);
    }
    public Address updateAddress(Address address) {
        if(!this.addressRepository.existsById(address.getId())) {
            throw  new RuntimeException("Address Not Found");
        }
        return this.addressRepository.save(address);
    }
}
