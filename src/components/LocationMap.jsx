
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateRiderLocation } from "@/services/dataService";

export default function LocationMap({ location, riderId, onLocationUpdate }) {
  const [updating, setUpdating] = useState(false);
  
  // In a real app, this would use a mapping API like Google Maps
  // For now, we'll simulate location updates
  
  const handleUpdateLocation = () => {
    setUpdating(true);
    
    // Simulate a slight location change
    const newLocation = {
      lat: location.lat + (Math.random() * 0.01 - 0.005),
      lng: location.lng + (Math.random() * 0.01 - 0.005)
    };
    
    // Update the location
    const updatedRider = updateRiderLocation(riderId, newLocation);
    
    if (onLocationUpdate) {
      onLocationUpdate(updatedRider.location);
    }
    
    setUpdating(false);
  };
  
  return (
    <div className="border rounded-md p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Current Location</h3>
        <p className="text-sm text-gray-600">Lat: {location.lat.toFixed(6)}</p>
        <p className="text-sm text-gray-600">Lng: {location.lng.toFixed(6)}</p>
      </div>
      
      <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
        <p className="text-gray-500">Map visualization would be here</p>
        {/* In a real app, this would be a map component */}
      </div>
      
      <Button 
        onClick={handleUpdateLocation} 
        disabled={updating} 
        className="w-full"
      >
        {updating ? "Updating Location..." : "Update Location"}
      </Button>
      
      <p className="mt-2 text-xs text-gray-500 text-center">
        Click to simulate location update
      </p>
    </div>
  );
}
