import ComingSoon from '../common/ComingSoon';
import DocumentationLink from '../common/DocumentationLink';

export default function RegisterUser() {
  return (
    <div className="container-fluid p-6">
      <h3>{`Register User `}
        <DocumentationLink docLink="https://docs.citycoins.co/core-protocol/registration-and-activation" />
      </h3>
      <ComingSoon />
    </div>
  );
}
