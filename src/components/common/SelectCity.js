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
      className="form-select"
      aria-label="Select a City"
      defaultValue={'none'}
      onChange={e => navToCity(e.currentTarget.value)}
    >
      <option value="none">Select a City...</option>
      <option value="atx">Austin, TX</option>
      <option value="mia">Miami, FL</option>
      <option value="nyc">New York, NY</option>
      <option value="sfo">San Fransciso, CA</option>
    </select>
  );
}
