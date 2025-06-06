import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import CartItem from "../components/CartItem";

function Orders() {
  const { cart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          {/*Cart total*/}
          <div className="text-end mt-4">
            <h5>Total: ${total.toFixed(2)}</h5>
          </div>

          <div className="text-end mt-4">
            <Link to="/checkout" className="btn btn-success">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
export default Orders;
