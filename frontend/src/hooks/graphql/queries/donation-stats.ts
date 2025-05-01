import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';

interface DonationStatsData {
  getTotalConfirmedDonationAmount: number;
  getTotalPendingDonationAmount: number;
}

const GET_DONATION_STATS = gql`
  query GetDonationStats {
    getTotalConfirmedDonationAmount
    getTotalPendingDonationAmount
  }
`;

export function useDonationStats() {
  return useGraphQLQuery<DonationStatsData>(GET_DONATION_STATS);
}