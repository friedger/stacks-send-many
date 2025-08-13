import {
  BufferCV,
  bufferCVFromString,
  fetchCallReadOnlyFunction,
  OptionalCV,
  PrincipalCV,
  principalCV,
  ResponseErrorCV,
  ResponseOkCV,
  TupleCV,
  UIntCV,
} from '@stacks/transactions';
import { BNS_CONTRACT_ADDRESS, BNS_CONTRACT_NAME, NETWORK } from './constants';

export const getNameFromAddress = async (addr: string) => {
  let addrCV = principalCV(addr);
  const result = (await fetchCallReadOnlyFunction({
    contractAddress: BNS_CONTRACT_ADDRESS,
    contractName: BNS_CONTRACT_NAME,
    functionName: 'get-primary-name',
    functionArgs: [addrCV],
    senderAddress: addr,
    network: NETWORK,
  })) as ResponseOkCV<TupleCV<{ name: BufferCV; namespace: BufferCV }>> | ResponseErrorCV;
  return result;
};

export const getNameInfo = async (fqName: string) => {
  const [name, namespace] = fqName.split('.');
  const result = (await fetchCallReadOnlyFunction({
    contractAddress: BNS_CONTRACT_ADDRESS,
    contractName: BNS_CONTRACT_NAME,
    functionName: 'get-bns-info',
    functionArgs: [bufferCVFromString(name), bufferCVFromString(namespace)],
    senderAddress: BNS_CONTRACT_ADDRESS,
    network: NETWORK,
  })) as
    | OptionalCV<
        TupleCV<{
          owner: PrincipalCV;
          'renewal-height': UIntCV;
          'registered-at': OptionalCV<UIntCV>;
          'imported-at': OptionalCV<UIntCV>;
        }>
      >
    | ResponseErrorCV;
  console.log({ result });
  return result;
};
