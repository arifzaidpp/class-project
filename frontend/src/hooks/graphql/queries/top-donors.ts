import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { Donation } from '../../../types/graphql.type';

interface TopContributorsData {
  getTopDonorsOfYesterday: Donation[];
}

const GET_TOP_DONORS_OF_YESTERDAY = gql`
  query GetTopDonorsOfYesterday {
    getTopDonorsOfYesterday {
      id
      name
      amount
      status
      createdAt
    }
  }
`;

export function useTopContributors() {
  return useGraphQLQuery<TopContributorsData>(GET_TOP_DONORS_OF_YESTERDAY);
}