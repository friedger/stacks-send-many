export default function SelectCity() {
  return (
    <select className="form-select" aria-label="Select a City" defaultValue={'none'}>
      <option value="none">Select a City</option>
      <option value="atx">Austin, TX</option>
      <option value="mia">Miami, FL</option>
      <option value="nyc">New York, NY</option>
      <option value="sfo">San Fransciso, CA</option>
    </select>
  );
}
