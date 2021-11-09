import { navigate } from '@reach/router';
import { currentCityList } from '../../store/common';
import { testnet } from '../../lib/stacks';

const navToCity = city => {
  if (city === 'none' || city === undefined) {
    navigate(`/${testnet ? '?chain=testnet' : '?chain=mainnet'}`);
  } else {
    navigate(`/${city.toLowerCase()}${testnet ? '?chain=testnet' : '?chain=mainnet'}`);
  }
};

export default function SelectCity() {
  const cityListArray = Object.entries(currentCityList);

  return (
    <select
      className="form-select form-select-lg w-75 mx-auto"
      aria-label="Select a City"
      onChange={e => navToCity(e.currentTarget.value)}
    >
      <option value="none">Choose a City...</option>
      {cityListArray.map(([key, value]) => (
        <option key={key} value={value.symbol}>
          {value.name}
        </option>
      ))}
    </select>
  );
}
