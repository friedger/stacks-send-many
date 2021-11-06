import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function Unauthorized(props) {
  return (
    <>
      <NavBar city={props.city} symbol={props.symbol} path={props.path} />
      <div className="text-center">
        <h3 className="mb-3">401 - Unauthorized!</h3>
        <p>
          Sorry, this page requires logging in with the{' '}
          <a href="https://hiro.so/wallet/install-web" target="_blank" rel="noreferrer">
            Hiro Wallet Browser Extension
          </a>
          .
        </p>
        <p>
          Please check that you have the extension installed and enabled, or use the navigation to
          select a new page.
        </p>
      </div>
      <hr />
      <NavBackHome />
    </>
  );
}
