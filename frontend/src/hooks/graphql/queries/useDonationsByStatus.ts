import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { Donation } from '../../../types/graphql.type'; // Make sure to fix the file extension

interface DonationsByStatusData {
  getDonationsByStatus: Donation[];
}

const GET_DONATIONS_BY_STATUS = gql`
  query GetDonationsByStatus {
    getDonationsByStatus {
      id
      name
      phoneNumber
      amount
      countryName
      stateName
      cityName
      pincode
      status
      createdAt
    }
  }
`;

export function useDonationsByStatus() {
  return useGraphQLQuery<DonationsByStatusData>(GET_DONATIONS_BY_STATUS);
}