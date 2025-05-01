import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { Donation } from '../../../types/graphql.type';

interface DonationsByDeviceData {
  getDonations: Donation[];
}

interface DonationsByDeviceVars {
  deviceId: string;
}

const GET_DONATIONS_BY_DEVICE = gql`
  query GetDonationsByDevice($deviceId: String!) {
    getDonations(deviceId: $deviceId) {
      id
      name
      phoneNumber
      amount
      countryName
      stateName
      cityName
      pincode
      screenshotLink
      status
      createdAt
    }
  }
`;

export function useDonationsByDevice(deviceId?: string) {
  return useGraphQLQuery<DonationsByDeviceData, DonationsByDeviceVars>(
    GET_DONATIONS_BY_DEVICE, 
    { 
      variables: { deviceId: deviceId || '' },
      skip: !deviceId,
      fetchPolicy: 'network-only' // Ensures we get fresh data on each visit
    }
  );
}