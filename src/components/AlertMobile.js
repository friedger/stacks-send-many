import React from 'react';

export function AlertMobile() {
  return (
    <div className="alert alert-warning alert-dismissible fade show d-md-none" role="alert">
      <p className="fw-bold">
        <i className="bi bi-exclamation-triangle fs-3"></i> This site was designed for use on
        Desktop with the{' '}
        <a className="alert-link" href="https://hiro.so/wallet/install-web">
          Stacks Web Wallet
        </a>{' '}
        browser extension.
      </p>
      <p>
        Please visit the{' '}
        <a href="https://chat.citycoins.co" target="_blank" rel="noreferrer" className="alert-link">
          CityCoins Discord
        </a>{' '}
        or documentation linked above for more information.
      </p>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}
