import React from 'react';
import { PoxLiteInfo } from './PoxLiteInfo';

export function CityCoinDashboard() {
  return (
    <>
      <h3>Dashboard</h3>
      <p>
        Statistics from <code>get-pox-lite-info</code> function.
      </p>
      <PoxLiteInfo />
    </>
  );
}
