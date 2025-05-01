import { gql } from '@apollo/client';
import { useGraphQLQuery } from '../useGraphQLQuery';
import { Sponsor } from '../../../types/graphql.type';

interface SponsorsData {
  getAllSponsors: Sponsor[];
}

const GET_ALL_SPONSORS = gql`
  query GetAllSponsors {
    getAllSponsors {
      id
      name
      imageLink
      role
      place
      contributions {
        sponsorId
        itemId
        countContributed
        sponsorItem {
          id
          itemName
          price
        }
      }
    }
  }
`;

export function useSponsors() {
  return useGraphQLQuery<SponsorsData>(GET_ALL_SPONSORS);
}