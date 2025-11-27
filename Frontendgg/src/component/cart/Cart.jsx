import React, { useEffect } from "react";
import { useParams, Link , useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getUserCart,
  updateQuantity,
  removeItemFromCart,
} from "../../store/features/cartSlice";
import { Card } from "react-bootstrap";
import ProductImage from "../utils/ProductImage";
import QuantityUpdater from "../utils/QuantityUpdater";
import LoadSpinner from "../common/LoadSpinner";
import { toast, ToastContainer } from "react-toastify";
import { placeOrder } from "../../store/features/orderSlice";

const Cart = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoading = useSelector((state) => state.cart.isLoading);
  const {successMessage , errorMessage} = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && cartId) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      dispatch(removeItemFromCart({ cartId, itemId }));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePlaceOrder = async () => {
    // if (cart.items.length > 0) {
    //   try {
    //     const result = await dispatch(placeOrder(userId)).unwrap();
    //     dispatch(clearCart());
    //     toast.success(result.message);
    //   } catch (error) {      
    //     toast.error(error.message);
       
    //   }
    // } else {
    //   toast.error("Cannot place order on empty cart");
    // }
    navigate(`/checkout/${userId}/checkout`)
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <div className='container mt-5 mb-5 p-5'>
      <ToastContainer />

      {cart.items.length === 0 ? (
        <h3 className='mb-4 cart-title'>Your cart is empty</h3>
      ) : (
        <div className='d-flex flex-column'>
          <div className='d-flex justify-content-between mb-4 fw-bold'>
            <div className='text-center'>Image</div>
            <div className='text-center'>Name</div>
            <div className='text-center'>Brand</div>
            <div className='text-center'>Price</div>
            <div className='text-center'>Quantity</div>
            <div className='text-center'>Total Price</div>
            <div className='text-center'> Action</div>
          </div>
          <hr className='mb-2 mt-2' />

          <h3 className='mb-4 cart-title'>My Shopping Cart</h3>

          {cart.items && cart.items.length > 0 && cart.items.map((item, index) => (
            item.product ? (<Card key={index} className='mb-4'>
              <Card.Body className='d-flex justify-content-between align-items-center shadow'>
                <div className='d-flex align-items-center'>
                  <Link to={"#"}>
                    <div className='cart-image-container'>
                      {item.product.images.length > 0 && (
                        <ProductImage productId={item.product.images[0].id} />
                      )}
                    </div>
                  </Link>
                </div>

                <div className='text-center'>{item.product.name}</div>
                <div className='text-center'>{item.product.brand}</div>
                <div className='text-center'>
                  ${item.product.price.toFixed(2)}
                </div>
                <div className='text-center'>
                  <QuantityUpdater
                    quantity={item.quantity}
                    onDecrease={() => handleDecreaseQuantity(item.product.id)}
                    onIncrease={() => handleIncreaseQuantity(item.product.id)}
                  />
                </div>
                <div className='text-center'>${item.totalPrice.toFixed(2)}</div>
                <div>
                  <Link
                    to={"#"}
                    onClick={() => handleRemoveItem(item.product.id)}>
                    <span className='remove-item'>Remove</span>
                  </Link>
                </div>
              </Card.Body>
            </Card>):null
          ))}

          <hr />

          <div className='cart-footer d-flex align-items-center mt-4'>
            <h4 className='mb-0 cart-title'>
              Total Cart Amount: ${cart.totalAmount.toFixed(2)}
            </h4>
            <div className='ms-auto checkout-links'>
              <Link to={"/products"}>Continue Shopping</Link>
              <Link to={"#"} onClick={handlePlaceOrder}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
