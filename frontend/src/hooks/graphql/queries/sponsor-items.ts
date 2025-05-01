import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { SponsorItem } from '../../../types/graphql.type';

interface SponsorItemsData {
  getAllSponsorItems: SponsorItem[];
}

interface SponsorItemData {
  getSponsorItem: SponsorItem;
}

interface SponsorItemVars {
  id: string;
}

const GET_SPONSOR_ITEM = gql`
  query GetSponsorItem($id: String!) {
    getSponsorItem(id: $id) {
      id
      itemName
      price
      count
      sponsoredCount
    }
  }
`;

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

export function useSponsorItems(itemId?: string) {
  if (itemId) {
    return useGraphQLQuery<SponsorItemData>(GET_SPONSOR_ITEM, { variables: { id: itemId } });
  }
  return useGraphQLQuery<SponsorItemsData>(GET_ALL_SPONSOR_ITEMS);
}