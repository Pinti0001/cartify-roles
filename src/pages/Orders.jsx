
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import OrderCard from "@/components/OrderCard";
import { getOrdersByUserId } from "@/services/dataService";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch user's orders
    const fetchOrders = () => {
      try {
        const userOrders = getOrdersByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, navigate]);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <PackageOpen size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">
              You haven't placed any orders yet.
            </p>
            <Button asChild>
              <a href="/products">Start shopping</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdate={handleOrderUpdate}
                isAdmin={false}
                isRider={false}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
