import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { Donation } from '../../../types/graphql.type';

interface DonationsData {
  getDonations: Donation[];
}

interface DonationsVars {
  deviceId: string;
}

const GET_DONATIONS = gql`
  query GetDonations($deviceId: String!) {
    getDonations(deviceId: $deviceId) {
      id
      deviceId
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

export function useDonations(deviceId: string) {
  return useGraphQLQuery<DonationsData, DonationsVars>(GET_DONATIONS, {
    variables: { deviceId },
  });
}