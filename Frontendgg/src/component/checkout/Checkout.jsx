import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getUserCart } from "../../store/features/cartSlice";
import {
  placeOrder,
  createPaymentIntent,
} from "../../store/features/orderSlice";
import { getUserById, fetchAddresses } from "../../store/features/userSlice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Col, Container, FormGroup, Row, Form, Card } from "react-bootstrap";
import AddressForm from "../common/AddressForm";
import { toast, ToastContainer } from "react-toastify";
import { cardElementOptions } from "../utils/cardElementOptions";
import { ClipLoader } from "react-spinners";

const Checkout = () => {
  const dispatch = useDispatch();
  const { userId } = useParams(); // userId : 28
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Fetch user data
        await dispatch(getUserById(userId)).unwrap();
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user information");
      } finally {
        setIsLoadingUserData(false);
      }
    };

    dispatch(getUserCart(userId));
    loadUserData();
  }, [dispatch, userId]);

  // Populate user info and billing address when user data loads
  useEffect(() => {
    if (user) {
      setUserInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });

      // Populate billing address with first address from user's address list
      if (user.addressList && user.addressList.length > 0) {
        const firstAddress = user.addressList[0];
        setBillingAddress({
          street: firstAddress.street || "",
          city: firstAddress.city || "",
          state: firstAddress.state || "",
          country: firstAddress.country || "",
          postalCode: firstAddress.postalCode || ""
        });
      }
    }
  }, [user]);

  const handlePaymentAndOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

  
    if (!stripe || !elements) {
      toast.error("Loading..., please try again");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {

      const { clientSecret } = await dispatch(
        createPaymentIntent({
          amount: cart.totalAmount, 
          currency: "usd", 
        })
      ).unwrap();


      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${userInfo.firstName} ${userInfo.lastName}`,
              email: userInfo.email,
              address: {
                line1: billingAddress.street,
                city: billingAddress.city,
                state: billingAddress.state,
                country: billingAddress.country,
                postal_code: billingAddress.postalCode,
              },
            },
          },
        }
      );
      // 4. Place the order after successful payment

      if (error) {
        toast.error(error.message);
        return;
      }
      if (paymentIntent.status === "succeeded") {
        await dispatch(placeOrder({ userId })).unwrap(); // userId : 28
        toast.success("Payment successful! Your order has been placed.");
        setTimeout(() => {
          window.location.href=`/user-profile/${userId}/profile`;          
        }, 5000);       
      }
    } catch (error) {
      toast.error("Error processing payment: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='mt-5 mb-5'>
      <ToastContainer />
      <div className='d-flex justify-content-center'>
        <Row>
          <Col md={8}>
            <Form className='p-4 border rounded shadow-sm'>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <label htmlFor='firstName' className='form-label'>
                      Firstname
                    </label>
                    <input
                      type='text'
                      className='form-control mb-2'
                      id='name'
                      name='firstName'
                      value={userInfo.firstName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <label htmlFor='lastName' className='form-label'>
                      Lastname
                    </label>
                    <input
                      type='text'
                      className='form-control mb-2'
                      id='name'
                      name='lastName'
                      value={userInfo.lastName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control mb-2'
                  id='email'
                  name='email'
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <div>
                <h6>Billing Address</h6>
                
                {user?.addressList && user.addressList.length > 1 && (
                  <FormGroup className="mb-3">
                    <label htmlFor="addressSelect" className="form-label">
                      Select a saved address:
                    </label>
                    <select
                      id="addressSelect"
                      className="form-control"
                      onChange={(e) => {
                        const selectedIndex = parseInt(e.target.value);
                        if (selectedIndex >= 0 && user.addressList[selectedIndex]) {
                          const selectedAddress = user.addressList[selectedIndex];
                          setBillingAddress({
                            street: selectedAddress.street || "",
                            city: selectedAddress.city || "",
                            state: selectedAddress.state || "",
                            country: selectedAddress.country || "",
                            postalCode: selectedAddress.postalCode || "",

                          });
                        }
                      }}
                    >
                      <option value="-1">Select an address</option>
                      {user.addressList.map((addr, idx) => (
                        <option key={idx} value={idx}>
                          {addr.street}, {addr.city}, {addr.state}, {addr.country}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                )}
                
                <AddressForm
                  onChange={handleAddressChange}
                  address={billingAddress}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='card-element' className='form-label'>
                  <h6>Credit or Debit Card</h6>
                </label>
                <div id='card-element' className='form-control'>
                  <CardElement
                    options={cardElementOptions}
                    onChange={(event) => {
                      setCardError(event.error ? event.error.message : "");
                    }}
                  />
                  {cardError && <div className='text-danger'>{cardError}</div>}
                </div>
                    <div className='text-muted d-block mt-2'>
                        Use dummy card number 4242 4242 4242 4242, CVV 123 and expiry 12/34 for testing.
                    </div>
              </div>
            </Form>
          </Col>

          <Col md={4}>
            <h6 className='mt-4 text-center cart-title'>Your Order Summary</h6>
            <hr />
            <Card style={{ backgroundColor: "whiteSmoke" }}>
              <Card.Body>
                <Card.Title className='mb-2 text-muted text-success'>
                  Total Amount : ${cart.totalAmount.toFixed(2)}
                </Card.Title>
              </Card.Body>

              <button
                type='submit'
                className='btn btn-warning mt-3'
                disabled={!stripe}
                onClick={(e) => handlePaymentAndOrder(e)}>
                {loading ? (
                  <ClipLoader size={20} color={"#123abc"} />
                ) : (
                  "Pay Now"
                )}
              </button>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Checkout;
