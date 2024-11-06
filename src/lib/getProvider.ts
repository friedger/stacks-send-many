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

  if (!providerKey) {
    return (
      globalContext.XverseProviders.StacksProvider ||
      globalContext.XverseProvider ||
      globalContext.StacksProvider
    );
  }

  return globalContext.StacksProvider;
}
