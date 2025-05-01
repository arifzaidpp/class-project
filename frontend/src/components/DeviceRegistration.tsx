import { useEffect } from 'react';
import { useDevice } from '../hooks';
import { useDeviceId } from '../hooks/useDeviceId';

/**
 * Component that handles device registration when the app loads
 * This is a "behind the scenes" component that doesn't render anything visible
 */
export function DeviceRegistration() {
  const deviceId = useDeviceId();
  const { data, loading, error } = useDevice(deviceId || '');

  useEffect(() => {
    if (error) {
      console.error('Error registering device:', error);
    }
    if (data?.getOrCreateDevice) {
      console.log('Device registered successfully:', data.getOrCreateDevice.deviceId);
      // You can add additional logic here such as updating app state or analytics
    }
  }, [data, error]);

  // This component doesn't render anything visible
  return null;
}