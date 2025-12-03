package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.Voucher;
import com.Project.Bookstore.Repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoucherService {

    private final VoucherRepository voucherRepository;

    @Autowired
    public VoucherService(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    public Voucher getByCode(String code) {
        return voucherRepository.findByCode(code).orElse(null);
    }
}
