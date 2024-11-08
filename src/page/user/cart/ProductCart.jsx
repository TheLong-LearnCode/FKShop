import React, { useEffect, useState, useTransition } from "react";
import "../../../util/GlobalStyle/GlobalStyle.css";
import "./ProductCart.css";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateProductInCart,
  removeProductFromCart,
} from "../../../redux/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { IDLE } from "../../../redux/constants/status";
import { verifyToken } from "../../../service/authUser";

export default function ProductCart() {
  const cartProducts = useSelector((state) => state.cart.products);
  const cartStatus = useSelector((state) => state.cart.status);
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const [activeLink, setActiveLink] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Lưu trữ thông tin người dùng sau khi verify token
  const navigate = useNavigate();
  const [productToRemove, setProductToRemove] = useState(null);

  // Lấy thông tin người dùng từ Redux Store
  const user = useSelector((state) => state.auth);
  console.log("user in PRODUCTDETAIL: ", user);
  const userDataStatus = useSelector((state) => state.auth.data);

  var userToken;
  var userData;
  useEffect(() => {
    console.log("user.data.token: ", user.data?.token);
    if (user.data !== null) {
      userToken = user.data?.token;
    }
    if (user.status === IDLE && user.data !== null) {
      userToken = user.data;
    }
    console.log("userToken in PRODUCTDETAIL: ", userToken);
    console.log("user.data in PRODUCTDETAIL: ", user.data);

    const fetchUserInfo = async () => {
      try {
        userData = await verifyToken(userToken); // Gọi hàm verifyToken để lấy dữ liệu
        console.log("userData after verify token: ", userData);

        setUserInfo(userData); // Lưu thông tin user vào state
        console.log("userData after SETUSERINFO: ", userData);
        //userData.data -> lấy ra userInfo
      } catch (error) {
        console.error("Error verifying token: ", error);
      }
    };
    fetchUserInfo(); // Gọi API lấy thông tin người dùng
  }, [user.data]); //user.data là thông tin người dùng

  useEffect(() => {
    if (user && userInfo?.data?.accountID) {
      dispatch(fetchCart(userInfo?.data?.accountID));
    }
  }, [dispatch, user, userInfo]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleIncreaseQuantity = async (product) => {
    dispatch(
      updateProductInCart({
        accountID: userInfo?.data?.accountID,
        productID: product.productID,
        quantity: product.quantity + 1,
      })
    ).then(() => {
      dispatch(fetchCart(userInfo?.data?.accountID)); // Lấy giỏ hàng đã cập nhật sau khi thay đổi số lượng
    });
  };

  const handleDecreaseQuantity = (product) => {
    if (product.quantity > 1) {
      dispatch(
        updateProductInCart({
          accountID: userInfo?.data?.accountID,
          productID: product.productID,
          quantity: product.quantity - 1,
        })
      ).then(() => {
        dispatch(fetchCart(userInfo?.data?.accountID)); // Lấy giỏ hàng đã cập nhật sau khi thay đổi số lượng
      });
    } else {
      handleRemoveProduct(product);
    }
  };

  const handleRemoveProduct = (product) => {
    setProductToRemove(product);
    $("#confirmDeleteModal").modal("show");
  };

  const confirmRemoveProduct = () => {
    if (productToRemove) {
      dispatch(
        removeProductFromCart({
          accountID: userInfo?.data?.accountID,
          productID: productToRemove.productID,
        })
      ).then(() => {
        dispatch(fetchCart(userInfo?.data?.accountID));
        // Hide the modal after confirming
        $("#confirmDeleteModal").modal("hide");
      });
    }
  };

  const cancelRemoveProduct = () => {
    // Hide the modal when canceling
    $("#confirmDeleteModal").modal("hide");
  };

  if (cartStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (cartStatus === "failed") {
    return <div>Error loading cart. Please try again.</div>;
  }

  return (
    <div className="fixed-header" style={{ minHeight: "350px" }}>
      <div className="container mt-4 cart-content">
        <h2 className="mb-4 text-center">Your Shopping Cart</h2>
        {cartProducts.length === 0 ? (
          <div className="text-center py-5 empty-cart">
            <h3 style={{ opacity: "0.5" }}>Your cart is empty</h3>
            <Link to="/" className="btn mt-3">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover cart-content-table">
                <thead>
                  <tr className="text-center">
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((product) => (
                    <tr key={product.productID} className="text-center">
                      <td>
                        <div className="d-flex">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="img-thumbnail mr-3"
                            style={{ maxWidth: "100px" }}
                          />
                          <h5>{product.name}</h5>
                        </div>
                      </td>
                      <td>{formatCurrency(product.price)}</td>
                      <td className="d-flex align-items-center justify-content-center">
                        <div className="input-group" style={{ width: "120px" }}>
                          <div className="input-group-prepend">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleDecreaseQuantity(product)}
                            >
                              -
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={product.quantity}
                            readOnly
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleIncreaseQuantity(product)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        {formatCurrency(product.price * product.quantity)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleRemoveProduct(product)}
                        >
                          <box-icon name="trash" color="#df1515"></box-icon>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-summary mt-4">
              <div className="empty-cart">
                <h4 className="mb-3">Order Summary</h4>
                <div className="d-flex justify-content-between">
                  <h5>Total:</h5>
                  <h5>
                    {formatCurrency(
                      cartProducts.reduce(
                        (total, product) =>
                          total + product.price * product.quantity,
                        0
                      )
                    )}
                  </h5>
                </div>
                <Link to={"/order"} className="btn btn-block mt-3">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}

        <div
          className="modal fade"
          id="confirmDeleteModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="confirmDeleteModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmDeleteModalLabel">
                  Confirm Deletion
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Do you want to delete {productToRemove?.name}?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={cancelRemoveProduct}
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmRemoveProduct}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
