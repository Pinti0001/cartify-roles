
import { useState } from "react";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { assignRider, updateOrderStatus } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

// Map status to colors
const statusColors = {
  "processing": "bg-blue-100 text-blue-800",
  "assigned": "bg-purple-100 text-purple-800",
  "in-transit": "bg-yellow-100 text-yellow-800",
  "delivered": "bg-green-100 text-green-800",
  "cancelled": "bg-red-100 text-red-800"
};

export default function OrderCard({ order, onUpdate, isAdmin, isRider }) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAssignToRider = async () => {
    setIsUpdating(true);
    try {
      const updatedOrder = assignRider(order.id, 3); // In a real app, you'd select a rider
      if (onUpdate) onUpdate(updatedOrder);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const location = newStatus === "delivered" 
        ? { lat: 40.7128, lng: -74.0060, status: "delivered" }
        : { lat: 40.7128, lng: -74.0060, status: newStatus };
        
      const updatedOrder = updateOrderStatus(order.id, newStatus, location);
      if (onUpdate) onUpdate(updatedOrder);
    } finally {
      setIsUpdating(false);
    }
  };

  const orderDate = new Date(order.orderDate);
  const timeAgo = formatDistance(orderDate, new Date(), { addSuffix: true });

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <CardDescription>
              Placed {timeAgo} • {order.items.length} item(s) • ${order.totalAmount.toFixed(2)}
            </CardDescription>
          </div>
          <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="items">
            <AccordionTrigger>Order Items</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} {item.selectedColor && `• Color: ${item.selectedColor}`} 
                          {item.selectedSize && `• Size: ${item.selectedSize}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping Details</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700">{order.shippingAddress}</p>
              {order.assignedRider && (
                <p className="text-gray-700 mt-2">
                  <span className="font-medium">Assigned Rider:</span> Rider ID #{order.assignedRider}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2">
        {isAdmin && order.status === "processing" && (
          <Button 
            onClick={handleAssignToRider} 
            disabled={isUpdating}
            variant="outline"
          >
            Assign to Rider
          </Button>
        )}
        
        {isRider && order.assignedRider === user.id && (
          <>
            {order.status === "assigned" && (
              <Button 
                onClick={() => handleUpdateStatus("in-transit")} 
                disabled={isUpdating}
                variant="default"
              >
                Start Delivery
              </Button>
            )}
            
            {order.status === "in-transit" && (
              <Button 
                onClick={() => handleUpdateStatus("delivered")} 
                disabled={isUpdating}
                variant="default"
              >
                Mark as Delivered
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
