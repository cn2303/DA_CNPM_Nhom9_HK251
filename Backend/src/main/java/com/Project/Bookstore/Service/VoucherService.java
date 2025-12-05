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
    public Voucher getVoucherById(Integer id) {
        return this.voucherRepository.findById(id).orElse(null);
    }
    public Voucher saveVoucher(Voucher voucher) {
        return this.voucherRepository.save(voucher);
    }
    public void deleteVoucher(Integer id) {
        this.voucherRepository.deleteById(id);
    }
}
