package com.Project.Bookstore.Service;

import com.Project.Bookstore.Model.*;
import com.Project.Bookstore.Repository.BookRepository;
import com.Project.Bookstore.Repository.OrderAddressRepository;
import com.Project.Bookstore.Repository.OrderRepository;
import com.Project.Bookstore.Repository.VoucherRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final OrderAddressRepository orderAddressRepository;
    private final VoucherRepository voucherRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        BookRepository bookRepository,
                        OrderAddressRepository orderAddressRepository,
                        VoucherRepository voucherRepository) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.orderAddressRepository = orderAddressRepository;
        this.voucherRepository = voucherRepository;
    }
    public List<Order> getAllOrder() {
        return this.orderRepository.findAll();
    }
    public Order getOrderById(Integer id) {
        return this.orderRepository.findById(id).orElse(null);
    }
    public Order saveOrder(Order order) {
        OrderAddress orderAddress = this.orderAddressRepository.findById(order.getOrderAddress().getId())
                .orElseThrow(()-> new RuntimeException("OrderAddress not found"));
        order.setOrderAddress(orderAddress);

        order.setSubtotalPrice(BigDecimal.ZERO);

        for(OrderItem item: order.getOrderItemList()){
            Book book = this.bookRepository.findById(item.getBook().getId())
                    .orElseThrow(()-> new RuntimeException("Book not found"));
            item.setBook(book);
            item.setOrder(order);
            item.setPrice(book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));

            order.setSubtotalPrice(order.getSubtotalPrice().add(item.getPrice()));
        }
        if(order.getVoucher()!=null){
            Voucher voucher = this.voucherRepository.findById(order.getVoucher().getCode())
                    .orElseThrow(()-> new RuntimeException("Voucher not found"));
            order.setVoucher(voucher);
            BigDecimal percent= BigDecimal.valueOf(voucher.getPercent());
            order.setDiscountTotal(order.getSubtotalPrice().multiply(percent).divide(BigDecimal.valueOf(100)));
        }
        else {
            order.setVoucher(null);
            order.setDiscountTotal(BigDecimal.ZERO);
        }
        BigDecimal finalPrice = (order.getSubtotalPrice()
                .subtract(order.getDiscountTotal()))
                .add(order.getShippingFee());
        order.setGrandTotalPrice(finalPrice);
        return this.orderRepository.save(order);
    }
    @Transactional
    public Order updateOrder(Order order) {
        Order existingOrder = this.orderRepository.findById(order.getId())
                .orElseThrow(()-> new RuntimeException("Order Not Found"));

        existingOrder.setStatus(order.getStatus());
        existingOrder.setOrderDate(order.getOrderDate());
        existingOrder.setShippingFee(order.getShippingFee());
        existingOrder.setPaymentMethod(order.getPaymentMethod());

        //Set to 0
        existingOrder.setSubtotalPrice(BigDecimal.ZERO);

        OrderAddress orderAddress = this.orderAddressRepository.findById(order.getOrderAddress().getId())
                .orElseThrow(()-> new RuntimeException("Order Address Not Found"));
        existingOrder.setOrderAddress(orderAddress);

        existingOrder.getOrderItemList().clear();
        for (OrderItem orderItem : order.getOrderItemList()) {
            OrderItem orderItemEntity = new OrderItem();

            //set book
            Book book = this.bookRepository.findById(orderItem.getBook().getId())
                    .orElseThrow(()-> new RuntimeException("Book Not Found"));

            orderItemEntity.setBook(book);
            orderItemEntity.setOrder(existingOrder);

            orderItemEntity.setQuantity(orderItem.getQuantity());
            orderItemEntity.setPrice(book.getPrice().multiply(new BigDecimal(orderItem.getQuantity())));
            orderItemEntity.setId(new OrderItemId(existingOrder.getId(), book.getId()));
            //update orderItem List
            existingOrder.getOrderItemList().add(orderItemEntity);
            //update price
            existingOrder.setSubtotalPrice(existingOrder.getSubtotalPrice().add(orderItemEntity.getPrice()));
        }
        //update voucher and price
        if(order.getVoucher() != null) {
            Voucher voucher = this.voucherRepository.findById(order.getVoucher().getCode())
                    .orElseThrow(()-> new RuntimeException("Voucher Not Found"));
            existingOrder.setVoucher(voucher);
            BigDecimal percent = BigDecimal.valueOf(voucher.getPercent());
            existingOrder.setDiscountTotal(existingOrder.getSubtotalPrice().multiply(percent).divide(new BigDecimal(100)));
        }
        else {
            existingOrder.setVoucher(null);
            existingOrder.setDiscountTotal(BigDecimal.ZERO);
        }
        //Update final price
        BigDecimal finalPrice = existingOrder.getSubtotalPrice()
                .subtract(existingOrder.getDiscountTotal())
                .add(existingOrder.getShippingFee());

        existingOrder.setGrandTotalPrice(finalPrice);

        return this.orderRepository.save(existingOrder);
    }
    public void deleteOrderById(Integer id) {
        this.orderRepository.deleteById(id);
    }
    public List<Order> getOrderByUserId(Integer id) {
        return this.orderRepository.findByUserId(id);
    }
    public  List<Order> getOrderByStatus(OrderStatus status) {
        return this.orderRepository.findByStatus(status);
    }
    public  List<Order> getOrderByStatusAndUser(OrderStatus status, Integer id) {
        return this.orderRepository.findByStatusAndUserId(status, id);
    }
    public Order changeOrderStatus(Integer id, OrderStatus status) {
        Order order = this.orderRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Order Not Found"));
        order.setStatus(status);
        return this.orderRepository.save(order);
    }
}
