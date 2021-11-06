export default function Footer() {
  return (
    <footer className="container text-center border-top mt-3 py-3">
      <div className="row">
        <div className="col-md-4">
          <a href="https://docs.citycoins.co" target="_blank" rel="noreferrer" className="nav-link">
            <i className="bi bi-info-circle"></i> Read the Docs
          </a>
        </div>
        <div className="col-md-4">
          <a href="https://chat.citycoins.co" target="_blank" rel="noreferrer" className="nav-link">
            <i className="bi bi-discord"></i> Join the Discord
          </a>
        </div>
        <div className="col-md-4">
          <a
            href="https://github.com/citycoins/citycoin-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            <i className="bi bi-github"></i> View on GitHub
          </a>
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="mt-3 fs-6 fst-italic">
          * Requires the{' '}
          <a
            href="https://www.hiro.so/wallet/install-web"
            target="_blank"
            rel="noreferrer"
            className="link-primary text-decoration-none"
          >
            Hiro Wallet Browser Extension
          </a>
        </p>
      </div>
    </footer>
  );
}
