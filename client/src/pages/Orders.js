import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import CartItem from "../components/CartItem";

function Orders() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container mt-4">
      <h2>Current Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="text-end mt-4">
            <button className="btn btn-success" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
