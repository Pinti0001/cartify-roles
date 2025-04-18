
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import OrderCard from "@/components/OrderCard";
import { getOrders } from "@/services/dataService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      return;
    }

    // Fetch all orders
    const fetchOrders = () => {
      try {
        const allOrders = getOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin, isAuthenticated, navigate]);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
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
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="text-lg font-medium">Total Orders</h3>
              <p className="text-3xl font-bold mt-2">{orders.length}</p>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-4">
              <h3 className="text-lg font-medium">Processing</h3>
              <p className="text-3xl font-bold mt-2">
                {orders.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4">
              <h3 className="text-lg font-medium">In Transit</h3>
              <p className="text-3xl font-bold mt-2">
                {orders.filter(o => o.status === 'in-transit').length}
              </p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <h3 className="text-lg font-medium">Delivered</h3>
              <p className="text-3xl font-bold mt-2">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <Button variant="outline" onClick={() => setActiveTab("all")}>
              Reset Filter
            </Button>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdate={handleOrderUpdate}
                    isAdmin={true}
                    isRider={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
