import React from 'react';
export function Tx({ tx }) {
  const apiData = tx.apiData;
  const txId = apiData.tx_id;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(txId);
  };
  const openTxInExplorer = () => {
    window.open(`https://explorer.stacks.co/txid/${txId}`, '_blank');
  };
  const openTx = () => {
    window.location.href = `/txid/${txId}`;
  };
  return (
    <>
      <small>{txId}</small>
      <i class="bi bi-clipboard" onClick={copyToClipboard}></i>
      <i class="bi bi-link-45deg" onClick={openTxInExplorer}></i>
      <i class="bi bi-link-45deg" onClick={openTx}></i>
    </>
  );
}