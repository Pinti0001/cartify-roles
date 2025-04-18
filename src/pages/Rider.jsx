
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import OrderCard from "@/components/OrderCard";
import LocationMap from "@/components/LocationMap";
import { getRiderOrders, getRiderLocation } from "@/services/dataService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Rider() {
  const { user, isRider, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");

  useEffect(() => {
    if (!isAuthenticated || !isRider) {
      navigate("/login");
      return;
    }

    // Fetch rider's assigned orders and location
    const fetchData = () => {
      try {
        const riderOrders = getRiderOrders(user.id);
        const riderLocation = getRiderLocation(user.id);
        
        setOrders(riderOrders);
        setLocation(riderLocation);
      } catch (error) {
        console.error("Error fetching rider data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isRider, isAuthenticated, navigate, user]);

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const handleLocationUpdate = (newLocation) => {
    setLocation(newLocation);
  };

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Rider Dashboard</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
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
        <h1 className="text-3xl font-bold mb-8">Rider Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Deliveries</CardTitle>
                  <CardDescription>All assigned orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">In Transit</CardTitle>
                  <CardDescription>Currently delivering</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {orders.filter(o => o.status === 'in-transit').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed</CardTitle>
                  <CardDescription>Delivered orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Location</CardTitle>
                <CardDescription>Update your current position</CardDescription>
              </CardHeader>
              <CardContent>
                {location ? (
                  <LocationMap 
                    location={location} 
                    riderId={user.id} 
                    onLocationUpdate={handleLocationUpdate}
                  />
                ) : (
                  <p>Location not available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="assigned" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="assigned">New Assignments</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No orders in this category</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdate={handleOrderUpdate}
                    isAdmin={false}
                    isRider={true}
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
