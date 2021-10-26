export default function SelectCity() {
  return (
    <select className="form-select" aria-label="Select a City">
      <option selected value="0">
        Select a City
      </option>
      <option value="1">Fort Lauderdale</option>
      <option value="2">Jacksonville</option>
      <option value="3">Miami</option>
      <option value="4">Orlando</option>
      <option value="5">Port St. Lucie</option>
      <option value="6">St. Petersburg</option>
      <option value="7">Tampa</option>
    </select>
  );
}
