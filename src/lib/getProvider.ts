import { getUserSession } from '@stacks/connect';

export function getProvider() {
  const profile = getUserSession().loadUserData().profile;
  const providerKey = profile.walletProvider;
  const globalContext = window as any;

  const address = profile.stxAddress.mainnet;
  if (address.startsWith('SM')) {
    return globalContext.AsignaProvider;
  }
  if (providerKey === 'leather') {
    return globalContext.LeatherProvider;
  }

  return (
    globalContext.XverseProvider ||
    globalContext.XverseProviders.StacksProvider ||
    globalContext.StacksProvider
  );
}
