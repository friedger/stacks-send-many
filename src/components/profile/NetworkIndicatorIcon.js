import React from 'react';

const mainNetSettings = { netType: 'Mainnet', color: 'bg-success' };
const testNetSettings = { netType: 'Testnet', color: 'bg-warning' };

const getNetwork = chainSuffix => {
  const net = chainSuffix.split('=')[1];

  const netMap = new Map();
  netMap.set('testnet', testNetSettings);
  netMap.set('mainnet', mainNetSettings);

  return netMap.get(net) || mainNetSettings;
};

const NetworkIndicatorIcon = ({ chainSuffix }) => {
  const network = getNetwork(chainSuffix);
  return (
    <i
      className="bi bi-person-circle me-2 position-relative"
      data-toggle="tooltip"
      data-placement="top"
      title={`You are on the ${network.netType} network`}
    >
      <span
        className={`position-absolute transform-network-indicator p-1 ${network.color} border-0 rounded-circle`}
      >
        <span className="visually-hidden">{network.netType}</span>
      </span>
    </i>
  );
};
export default NetworkIndicatorIcon;
