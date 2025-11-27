package com.gamegear.gamegear.service.order;

import com.gamegear.gamegear.dtos.OrderDto;
import com.gamegear.gamegear.model.Order;
import com.gamegear.gamegear.request.PaymentRequest;
import com.stripe.exception.StripeException;

import java.util.List;

public interface IOrderService {

    Order placeOrder(Long userId);
    List<OrderDto> getUserOrders(Long userId);

    String createPaymentIntent(PaymentRequest request) throws StripeException;

    OrderDto convertOrderDto(Order order);
}
