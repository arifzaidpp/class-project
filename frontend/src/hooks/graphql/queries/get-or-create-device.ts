import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { Device } from '../../../types/graphql.type';

interface DeviceData {
  getOrCreateDevice: Device;
}

interface DeviceVars {
  deviceId: string;
}

const GET_OR_CREATE_DEVICE = gql`
  query GetOrCreateDevice($deviceId: String!) {
    getOrCreateDevice(deviceId: $deviceId) {
      deviceId
      deviceType
      createdAt
    }
  }
`;

export function useDevice(deviceId: string) {
  return useGraphQLQuery<DeviceData, DeviceVars>(GET_OR_CREATE_DEVICE, {
    variables: { deviceId },
  });
}