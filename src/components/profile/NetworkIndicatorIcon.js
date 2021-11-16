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
        className={`position-absolute top-0 start-100 translate-middle p-2 ${network.color} border border-light rounded-circle`}
      >
        <span className="visually-hidden">{network.netType}</span>
      </span>
    </i>
  );
};
export default NetworkIndicatorIcon;
