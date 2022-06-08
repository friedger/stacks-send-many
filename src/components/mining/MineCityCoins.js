import ComingSoon from '../common/ComingSoon';
import DocumentationLink from '../common/DocumentationLink';

export default function MineCityCoins() {
  return (
    <div className="container-fluid p-6">
      <h3>{`Mine CityCoins `}
        <DocumentationLink docLink="https://docs.citycoins.co/core-protocol/mining-citycoins" />
      </h3>
      <ComingSoon />
    </div>
  );
}
