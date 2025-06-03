import { useCart } from "../CartContext";
import CartItem from "../components/CartItem";

function Orders() {
  const { cart } = useCart();

  return (
    <div>
      <h2>Current Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item) => <CartItem key={item.id} item={item} />)
      )}
    </div>
  );
}
export default Orders;
