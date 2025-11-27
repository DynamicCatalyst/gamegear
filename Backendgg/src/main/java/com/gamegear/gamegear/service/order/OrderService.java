package com.gamegear.gamegear.service.order;

import com.gamegear.gamegear.dtos.OrderDto;
import com.gamegear.gamegear.enums.OrderStatus;
import com.gamegear.gamegear.model.Cart;
import com.gamegear.gamegear.model.Order;
import com.gamegear.gamegear.model.OrderItem;
import com.gamegear.gamegear.model.Product;
import com.gamegear.gamegear.repository.OrderRepository;
import com.gamegear.gamegear.repository.ProductRepository;
import com.gamegear.gamegear.request.PaymentRequest;
import com.gamegear.gamegear.service.cart.ICartService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ICartService cartService;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public Order placeOrder(Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        Order order = createOrder(cart);

        List<OrderItem> orderItemList  = createOrderItems(order,cart);
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setTotalAmount(calculateTotalAmount(orderItemList));
        Order saveOrder = orderRepository.save(order);

        cartService.clearCart(cart.getId());

        return saveOrder;
    }

    private Order createOrder(Cart cart){
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return order;
    }

    private List<OrderItem> createOrderItems(Order order , Cart cart){
        return cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            product.setInventory(product.getInventory() - cartItem.getQuantity());
            productRepository.save(product);
            return new OrderItem(
                    order, product,
                    cartItem.getUnitPrice(),
                    cartItem.getQuantity());
        }).toList();
    }


    private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList){
        return orderItemList.stream().map(item -> item.getPrice()
                .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal:: add);
    }


    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        List<Order> orders =  orderRepository.findByUserId(userId);
        List<OrderDto> orderDtos = orders.stream().map(this::convertOrderDto).toList();
        return orderDtos;
    }

    @Override
    public String createPaymentIntent(PaymentRequest request) throws StripeException {
        long amountInSmallestUnit =Math.round(request.getAmount()*100);
        PaymentIntent intent = PaymentIntent.create(
                PaymentIntentCreateParams.builder()
                        .setAmount(amountInSmallestUnit)
                        .setCurrency(request.getCurrency())
                        .addPaymentMethodType("card")
                        .build());
        return intent.getClientSecret();
    }

    @Override
    public OrderDto convertOrderDto(Order order){
        OrderDto orderDto = modelMapper.map(order, OrderDto.class);
        return orderDto;
    }

}
