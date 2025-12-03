package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Voucher;
import com.Project.Bookstore.Service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "*")
public class VoucherController {

    private final VoucherService voucherService;

    @Autowired
    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping
    public List<Voucher> getAllVouchers() {
        return voucherService.getAllVouchers();
    }

    @GetMapping("/{code}")
    public Voucher getVoucherByCode(@PathVariable String code) {
        return voucherService.getByCode(code);
    }
}
