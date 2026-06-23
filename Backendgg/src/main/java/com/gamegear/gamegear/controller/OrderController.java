package com.gamegear.gamegear.controller;


import com.gamegear.gamegear.dtos.OrderDto;
import com.gamegear.gamegear.model.Order;
import com.gamegear.gamegear.request.PaymentRequest;
import com.gamegear.gamegear.response.ApiResponse;
import com.gamegear.gamegear.service.order.IOrderService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class OrderController {
    private final IOrderService  orderService;

    @PostMapping("/user/{userId}/place-order")
    public ResponseEntity<ApiResponse> placeOrder(@PathVariable Long userId){
        Order order = orderService.placeOrder(userId);
        OrderDto orderDto = orderService.convertOrderDto(order);
        return ResponseEntity.ok(new ApiResponse("Order Placed Successfully!", orderDto));
    }


    @GetMapping("/user/{userId}/orders")
    private ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId){
        List<OrderDto> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(new ApiResponse(" Success!", orders));
    }

    @PostMapping("/create-payment-intent")
    private ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest request) throws StripeException {
        String clientSecret = orderService.createPaymentIntent(request);
        return ResponseEntity.ok(Map.of("clientSecret",clientSecret));
    }

}
