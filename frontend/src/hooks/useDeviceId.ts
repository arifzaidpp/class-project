import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install uuid

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  
  useEffect(() => {
    // Try to get device ID from localStorage
    let storedDeviceId = localStorage.getItem('deviceId');
    
    // If not found, create a new one
    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem('deviceId', storedDeviceId);
    }
    
    setDeviceId(storedDeviceId);
  }, []);

  return deviceId;
}