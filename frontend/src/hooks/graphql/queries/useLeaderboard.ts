import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { Donation } from '../../../types/graphql.type';

interface LeaderboardData {
  getLeaderboardByTopAmount: Donation[];
}

const GET_LEADERBOARD = gql`
  query GetLeaderboard {
    getLeaderboardByTopAmount {
      id
      name
      amount
      deviceId
      createdAt
      phoneNumber
      countryName
      stateName
      cityName
    }
  }
`;

export function useLeaderboard() {
  return useGraphQLQuery<LeaderboardData>(GET_LEADERBOARD, {
    fetchPolicy: 'network-only' // Always get fresh data for leaderboard
  });
}