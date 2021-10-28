import { navigate } from '@reach/router';

const navToCity = city => {
  if (city === 'none' || city === undefined) {
    navigate('/');
  } else {
    navigate(`/${city}`);
  }
};

export default function SelectCity() {
  // TODO: these should be stored somewhere else and iterated over to create this component

  return (
    <select
      className="form-select w-75 mt-4 mx-auto"
      aria-label="Select a City"
      defaultValue={'none'}
      onChange={e => navToCity(e.currentTarget.value)}
    >
      <option value="none">Choose a City...</option>
      <option value="atx">Austin</option>
      <option value="mia">Miami</option>
      <option value="nyc">New York City</option>
      <option value="sfo">San Fransciso</option>
    </select>
  );
}
