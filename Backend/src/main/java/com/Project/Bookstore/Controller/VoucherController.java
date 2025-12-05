package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Voucher;
import com.Project.Bookstore.Service.BookService;
import com.Project.Bookstore.Service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/voucher")
public class VoucherController {
    private final VoucherService voucherService;
    @Autowired
    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }
    @GetMapping
    public List<Voucher> getAllVoucher() {
        return this.voucherService.getAllVouchers();
    }
    @GetMapping("/{id}")
    public Voucher getVoucher(@PathVariable Integer id) {
        return this.voucherService.getVoucherById(id);
    }
    @PostMapping
    public Voucher saveVoucher(@RequestBody Voucher voucher) {
        return this.voucherService.saveVoucher(voucher);
    }
    @PutMapping
    public Voucher updateVoucher(@RequestBody Voucher voucher) {
        return this.voucherService.saveVoucher(voucher);
    }
    @DeleteMapping
    public void deleteVoucher(@RequestBody Integer id) {
        this.voucherService.deleteVoucher(id);
    }

}
