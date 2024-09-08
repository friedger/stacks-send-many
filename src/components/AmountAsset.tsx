import { AssetInfo } from '../lib/constants';

export function AmountAsset({
  amount,
  className,
  assetInfo,
}: {
  amount: number;
  className?: string;
  assetInfo: AssetInfo;
}) {
  if (isNaN(amount)) {
    return amount;
  }
  return (
    <span className={className}>
      {(amount / assetInfo.decimals).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: assetInfo.decimals,
        maximumFractionDigits: assetInfo.decimals,
        useGrouping: true,
      })}{' '}
      {assetInfo.symbol || assetInfo.shortName}
    </span>
  );
}
