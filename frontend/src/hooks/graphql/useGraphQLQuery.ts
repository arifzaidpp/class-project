import { useQuery, useMutation, OperationVariables } from '@apollo/client';
import { DocumentNode } from 'graphql';

export function useGraphQLQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options?: {
    variables?: TVariables;
    fetchPolicy?: 'cache-first' | 'network-only' | 'cache-and-network' | 'no-cache';
    notifyOnNetworkStatusChange?: boolean;
    pollInterval?: number;
  }
) {
  return useQuery<TData, TVariables>(query, {
    fetchPolicy: options?.fetchPolicy || 'network-only',
    notifyOnNetworkStatusChange: options?.notifyOnNetworkStatusChange || true,
    pollInterval: options?.pollInterval,
    variables: options?.variables,
  });
}

export function useGraphQLMutation<TData = any, TVariables extends OperationVariables = OperationVariables>(
  mutation: DocumentNode,
  options?: {
    onCompleted?: (data: TData) => void;
    onError?: (error: any) => void;
  }
) {
  return useMutation<TData, TVariables>(mutation, {
    onCompleted: options?.onCompleted,
    onError: options?.onError,
  });
}