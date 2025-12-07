package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Voucher;
import com.Project.Bookstore.Repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class VoucherService {
    private final VoucherRepository voucherRepository;
    @Autowired
    public VoucherService(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }
    public List<Voucher> getAllVouchers() {
        return this.voucherRepository.findAll();
    }
    public Voucher getVoucherById(String id) {
        return this.voucherRepository.findById(id).
                orElseThrow(()-> new RuntimeException("Voucher not found!"));
    }
    public Voucher saveVoucher(Voucher voucher) {
        if(voucher.getPercent() <0 || voucher.getPercent() > 100){
            throw new RuntimeException("Percentage must be between 0 and 100");
        }
        if(voucher.getQuantity() <0){
            throw new RuntimeException("Quantity must be greater than 0");
        }
        return this.voucherRepository.save(voucher);
    }
    public Voucher updateVoucher(Voucher voucher) {
        if(!this.voucherRepository.existsById(voucher.getCode()))
            throw new RuntimeException("Voucher not found!");
        if(voucher.getPercent() <0 || voucher.getPercent() > 100){
            throw new RuntimeException("Percentage must be between 0 and 100");
        }
        if(voucher.getQuantity() <0){
            throw new RuntimeException("Quantity must be greater than 0");
        }
        return this.voucherRepository.save(voucher);
    }
    public void deleteVoucher(String id) {
        if(!this.voucherRepository.existsById(id))
            throw new RuntimeException("Voucher not found!");
        this.voucherRepository.deleteById(id);
    }
}
