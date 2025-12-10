package com.Project.Bookstore.Controller;

import com.Project.Bookstore.Model.Voucher;
import com.Project.Bookstore.Service.BookService;
import com.Project.Bookstore.Service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("http://localhost:5173")
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
    public ResponseEntity<?> getVoucher(@PathVariable String id) {
        try{
            Voucher voucher = this.voucherService.getVoucherById(id);
            return ResponseEntity.ok().body(voucher);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Voucher saveVoucher(@RequestBody Voucher voucher) {
        return this.voucherService.saveVoucher(voucher);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<?> updateVoucher(@RequestBody Voucher voucher) {
        try{
            Voucher voucher1 = this.voucherService.updateVoucher(voucher);
            return ResponseEntity.ok().body(voucher1);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable String id) {
        try {
            this.voucherService.deleteVoucher(id);
            return ResponseEntity.ok().body("Voucher deleted");
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
