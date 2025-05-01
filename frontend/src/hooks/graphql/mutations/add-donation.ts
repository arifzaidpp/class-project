import { gql } from '@apollo/client';
import { useGraphQLMutation } from '../useGraphQLQuery';
import { Donation, DonationStatus } from '../../../types/graphql.type';

interface AddDonationData {
  addDonation: Donation;
}

interface AddDonationVars {
  data: {
    deviceId: string;
    name: string;
    phoneNumber: string;
    amount: number;
    countryName: string;
    stateName: string;
    cityName: string;
    pincode: string;
    screenshotLink?: string;
    status?: DonationStatus;
  };
}

const ADD_DONATION = gql`
  mutation AddDonation($data: AddDonationInput!) {
    addDonation(data: $data) {
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

export function useAddDonation(
  onCompleted?: (data: AddDonationData) => void,
  onError?: (error: any) => void
) {
  return useGraphQLMutation<AddDonationData, AddDonationVars>(ADD_DONATION, {
    onCompleted,
    onError,
  });
}