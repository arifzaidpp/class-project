import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { SponsorItem } from '../../../types/graphql.type';

interface SponsorItemData {
  getSponsorItemById: SponsorItem;
}

interface SponsorItemVars {
  id: string;
}

const GET_SPONSOR_ITEM_BY_ID = gql`
  query GetSponsorItemById($id: String!) {
    getSponsorItemById(id: $id) {
      id
      itemName
      price
      count
      sponsoredCount
    }
  }
`;

export function useSponsorItem(id?: string) {
  return useGraphQLQuery<SponsorItemData, SponsorItemVars>(
    GET_SPONSOR_ITEM_BY_ID,
    { variables: { id: id || '' }, skip: !id }
  );
}