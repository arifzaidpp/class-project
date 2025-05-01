import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { SponsorItem } from '../../../types/graphql.type';

interface SponsorItemsData {
  getAllSponsorItems: SponsorItem[];
}

const GET_ALL_SPONSOR_ITEMS = gql`
  query GetAllSponsorItems {
    getAllSponsorItems {
      id
      itemName
      price
      count
      sponsoredCount
    }
  }
`;

export function useSponsorItems() {
  return useGraphQLQuery<SponsorItemsData>(GET_ALL_SPONSOR_ITEMS);
}