
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsAdding(true);
    // For simple products without variations, add directly to cart
    if (!product.sizes && !product.colors) {
      addToCart(product);
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden card-hover">
        <CardHeader className="p-0">
          <div className="aspect-square bg-gray-100 relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            {product.stock < 10 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Low Stock
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {(!product.sizes && !product.colors) ? (
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <span className="flex items-center">Adding...</span>
              ) : (
                <span className="flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </span>
              )}
            </Button>
          ) : (
            <Button className="w-full" variant="outline">View Details</Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
