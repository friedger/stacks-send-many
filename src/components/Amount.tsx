import { SUPPORTED_ASSETS, SupportedSymbols } from '../lib/constants';
import { AmountAsset } from './AmountAsset';
import { AmountFiat } from './AmountFiat';

export function Amount({
  amount,
  asset,
  className,
}: {
  amount: number;
  asset: SupportedSymbols;
  className?: string;
}) {
  if (asset === 'stx') {
    if (isNaN(amount)) {
      return amount;
    }
    return (
      <span className={className}>
        <AmountAsset amount={amount} assetInfo={SUPPORTED_ASSETS['stx']} /> (
        <AmountFiat ustx={amount} />)
      </span>
    );
  } else if (amount || amount === 0) {
    if (isNaN(amount)) {
      return amount;
    }
    return (
      <span className={className}>
        <AmountAsset amount={amount} assetInfo={SUPPORTED_ASSETS[asset]} />
      </span>
    );
  } else {
    return null;
  }
}
