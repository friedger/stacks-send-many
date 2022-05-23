import { isMainnet } from '../../lib/stacks';

const mainnetIcon = {
  name: 'Mainnet',
  color: 'bg-success',
};

const testnetIcon = {
  name: 'Testnet',
  color: 'bg-warning',
};

export function NetworkIndicatorIcon() {
  const network = isMainnet ? mainnetIcon : testnetIcon;
  return (
    <i
      className="bi bi-person-circle me-2 position-relative"
      data-toggle="tooltip"
      data-placement="top"
      title={`You are on the ${network.name} network`}
    >
      <span
        className={`position-absolute transform-network-indicator p-1 ${network.color} border-0 rounded-circle`}
      >
        <span className="visually-hidden">{network.name}</span>
      </span>
    </i>
  );
}
