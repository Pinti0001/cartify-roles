
// Mock data for the e-commerce store

// Products data
export const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 19.99,
    description: "A comfortable cotton t-shirt that goes with everything.",
    category: "clothing",
    image: "/placeholder.svg",
    rating: 4.5,
    stock: 50,
    colors: ["Black", "White", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    description: "Modern slim fit jeans with stretch for comfort.",
    category: "clothing",
    image: "/placeholder.svg",
    rating: 4.2,
    stock: 30,
    colors: ["Blue", "Black", "Gray"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 129.99,
    description: "Premium sound quality with noise cancellation.",
    category: "electronics",
    image: "/placeholder.svg",
    rating: 4.8,
    stock: 15,
    colors: ["Black", "White", "Silver"],
    sizes: null
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 89.99,
    description: "Lightweight running shoes with responsive cushioning.",
    category: "footwear",
    image: "/placeholder.svg",
    rating: 4.7,
    stock: 20,
    colors: ["Black/White", "Blue/Gray", "Red/Black"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 5,
    name: "Smartphone",
    price: 799.99,
    description: "Latest model with high-resolution camera and fast processor.",
    category: "electronics",
    image: "/placeholder.svg",
    rating: 4.9,
    stock: 10,
    colors: ["Black", "Silver", "Gold"],
    sizes: null
  },
  {
    id: 6,
    name: "Backpack",
    price: 49.99,
    description: "Durable backpack with multiple compartments.",
    category: "accessories",
    image: "/placeholder.svg",
    rating: 4.4,
    stock: 35,
    colors: ["Black", "Navy", "Green"],
    sizes: null
  },
];

// Mock orders data
let orders = [
  {
    id: "ORD-1001",
    userId: 1,
    items: [
      { ...products[0], quantity: 2, selectedSize: "M", selectedColor: "Black" },
      { ...products[3], quantity: 1, selectedSize: "9", selectedColor: "Blue/Gray" }
    ],
    totalAmount: 199.97,
    status: "processing",
    orderDate: "2025-04-15T10:30:00",
    shippingAddress: "123 Main St, City, Country",
    assignedRider: null
  },
  {
    id: "ORD-1002",
    userId: 1,
    items: [
      { ...products[4], quantity: 1, selectedSize: null, selectedColor: "Silver" }
    ],
    totalAmount: 799.99,
    status: "delivered",
    orderDate: "2025-04-10T14:45:00",
    shippingAddress: "456 Oak St, City, Country",
    assignedRider: 3,
    deliveryLocation: {
      lat: 40.7128,
      lng: -74.0060,
      status: "delivered"
    }
  },
  {
    id: "ORD-1003",
    userId: 1,
    items: [
      { ...products[2], quantity: 1, selectedSize: null, selectedColor: "Black" },
      { ...products[5], quantity: 1, selectedSize: null, selectedColor: "Navy" }
    ],
    totalAmount: 179.98,
    status: "in-transit",
    orderDate: "2025-04-17T09:15:00",
    shippingAddress: "789 Pine St, City, Country",
    assignedRider: 3,
    deliveryLocation: {
      lat: 40.7135,
      lng: -74.0046,
      status: "in-transit"
    }
  }
];

// Map of riders and their locations
let riders = [
  {
    id: 3, // matches the rider user ID
    name: "Rider One",
    location: {
      lat: 40.7128,
      lng: -74.0060
    },
    available: true
  }
];

// Get all products
export const getProducts = () => {
  return products;
};

// Get product by ID
export const getProductById = (id) => {
  return products.find(product => product.id === Number(id));
};

// Get all orders
export const getOrders = () => {
  return orders;
};

// Get order by ID
export const getOrderById = (id) => {
  return orders.find(order => order.id === id);
};

// Get orders by user ID
export const getOrdersByUserId = (userId) => {
  return orders.filter(order => order.userId === userId);
};

// Create a new order
export const createOrder = (orderData) => {
  const newOrder = {
    id: `ORD-${1000 + orders.length + 1}`,
    orderDate: new Date().toISOString(),
    status: "processing",
    assignedRider: null,
    ...orderData
  };
  
  orders = [...orders, newOrder];
  return newOrder;
};

// Assign a rider to an order
export const assignRider = (orderId, riderId) => {
  orders = orders.map(order => 
    order.id === orderId 
      ? { ...order, assignedRider: riderId, status: "assigned" } 
      : order
  );
  
  return getOrderById(orderId);
};

// Get orders assigned to a rider
export const getRiderOrders = (riderId) => {
  return orders.filter(order => order.assignedRider === riderId);
};

// Update order status
export const updateOrderStatus = (orderId, status, location = null) => {
  orders = orders.map(order => 
    order.id === orderId 
      ? { 
          ...order, 
          status, 
          deliveryLocation: location ? { ...order.deliveryLocation, ...location, status } : order.deliveryLocation 
        } 
      : order
  );
  
  return getOrderById(orderId);
};

// Update rider location
export const updateRiderLocation = (riderId, location) => {
  riders = riders.map(rider => 
    rider.id === riderId 
      ? { ...rider, location } 
      : rider
  );
  
  return riders.find(rider => rider.id === riderId);
};

// Get rider location
export const getRiderLocation = (riderId) => {
  const rider = riders.find(rider => rider.id === riderId);
  return rider ? rider.location : null;
};
