package com.Project.Bookstore.Repository;

import com.Project.Bookstore.Model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
}
