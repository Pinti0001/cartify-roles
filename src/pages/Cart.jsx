
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { createOrder } from "@/services/dataService";
import { toast } from "@/components/ui/use-toast";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleRemoveItem = (item) => {
    removeFromCart(item.id, item.selectedSize, item.selectedColor);
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) {
      toast({
        title: "Quantity limit reached",
        description: `Only ${item.stock} items available in stock.`,
      });
      return;
    }
    updateQuantity(item.id, item.selectedSize, item.selectedColor, newQuantity);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        description: "Please login to checkout",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!shippingAddress.trim()) {
      toast({
        description: "Please enter a shipping address",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderData = {
        userId: user.id,
        items: cartItems,
        totalAmount: getTotalPrice(),
        shippingAddress,
      };

      createOrder(orderData);
      clearCart();
      
      toast({
        title: "Order placed successfully",
        description: "Thank you for your order!",
      });
      
      navigate("/orders");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        title: "Checkout failed",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products" className="text-gray-500 hover:text-gray-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <ShoppingBag size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-5 bg-gray-50 p-4">
                  <div className="col-span-2">
                    <span className="font-medium">Product</span>
                  </div>
                  <div className="text-center">
                    <span className="font-medium">Price</span>
                  </div>
                  <div className="text-center">
                    <span className="font-medium">Quantity</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">Total</span>
                  </div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="grid grid-cols-1 sm:grid-cols-5 p-4 items-center">
                      <div className="sm:col-span-2 flex items-center mb-4 sm:mb-0">
                        <div className="w-16 h-16 bg-gray-100 rounded mr-4 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                          )}
                          {item.selectedColor && (
                            <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                          )}
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="text-red-500 text-sm flex items-center mt-1 sm:hidden"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-center mb-4 sm:mb-0">
                        <span className="sm:hidden text-gray-500 mr-2">Price:</span>
                        ${item.price.toFixed(2)}
                      </div>

                      <div className="flex justify-center items-center mb-4 sm:mb-0">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="sm:hidden text-gray-500 mr-2">Total:</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>

                      <div className="hidden sm:flex justify-end mt-4 sm:mt-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="shipping-address" className="block mb-2">
                    Shipping Address
                  </Label>
                  <Input
                    id="shipping-address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your full address"
                    required
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </Button>

                {!isAuthenticated && (
                  <p className="mt-4 text-sm text-gray-500">
                    You need to{" "}
                    <Link to="/login" className="text-primary">
                      login
                    </Link>{" "}
                    to complete your purchase.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
