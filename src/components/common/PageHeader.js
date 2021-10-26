import HeaderLogo from './HeaderLogo';
import HeaderTitle from './HeaderTitle';

// TODO: toggle display of profile small component and log out button

export default function PageHeader({ userSession }) {
  return (
    <header className="d-flex justify-content-between align-items-center p-3">
      <div>
        <HeaderLogo />
      </div>
      <div>
        <HeaderTitle />
      </div>
      <div className="btn-group btn-group-lg" role="group" aria-label="Connect Hiro Web Wallet">
        <button className="btn btn-lg btn-outline-primary" type="button" onClick={null}>
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
