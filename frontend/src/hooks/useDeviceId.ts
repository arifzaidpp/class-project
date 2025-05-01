import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Make sure you have this installed

/**
 * Hook that manages the device ID
 * - Retrieves device ID from localStorage if it exists
 * - Creates and stores a new device ID if it doesn't exist
 * @returns The device ID as a string
 */
export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  
  useEffect(() => {
    // Try to get device ID from localStorage
    let storedDeviceId = localStorage.getItem('deviceId');
    
    // If not found, create a new one
    if (!storedDeviceId) {
      storedDeviceId = uuidv4();
      localStorage.setItem('deviceId', storedDeviceId);
      console.log('Created new device ID:', storedDeviceId);
    } else {
      console.log('Using existing device ID:', storedDeviceId);
    }
    
    setDeviceId(storedDeviceId);
  }, []);

  return deviceId;
}