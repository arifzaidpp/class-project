import { gql } from '@apollo/client';
import { useGraphQLMutation } from '../useGraphQLQuery';
import { Donation, DonationStatus } from '../../../types/graphql.type';

interface UpdateDonationData {
  updateDonation: Donation;
}

interface UpdateDonationVars {
  id: string;
  data: {
    deviceId?: string;
    name?: string;
    phoneNumber?: string;
    amount?: number;
    countryName?: string;
    stateName?: string;
    cityName?: string;
    pincode?: string;
    screenshotLink?: string;
    status?: DonationStatus;
  };
}

const UPDATE_DONATION = gql`
  mutation UpdateDonation($id: String!, $data: UpdateDonationInput!) {
    updateDonation(id: $id, data: $data) {
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

export function useUpdateDonation(
  onCompleted?: (data: UpdateDonationData) => void,
  onError?: (error: any) => void
) {
  return useGraphQLMutation<UpdateDonationData, UpdateDonationVars>(UPDATE_DONATION, {
    onCompleted,
    onError,
  });
}