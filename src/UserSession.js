import { AppConfig } from '@stacks/auth';
import { Storage } from '@stacks/storage';
import { addressToString } from '@stacks/transactions';
import { getStacksAccount } from './lib/account';
import { debugLog } from './lib/common';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const STX_JSON_PATH = 'stx.json';

function afterSTXAddressPublished() {
  debugLog('STX address published');
  stxAddressSemaphore.putting = false;
}

const stxAddressSemaphore = { putting: false };
export function putStxAddress(userSession, address) {
  const storage = new Storage({ userSession });
  if (!stxAddressSemaphore.putting) {
    stxAddressSemaphore.putting = true;
    storage
      .putFile(STX_JSON_PATH, JSON.stringify({ address }), {
        encrypt: false,
      })
      .then(() => afterSTXAddressPublished())
      .catch(r => {
        debugLog(r);
        debugLog('STX address NOT published, retrying');
        storage.getFile(STX_JSON_PATH, { decrypt: false }).then(s => {
          userSession
            .putFile(STX_JSON_PATH, JSON.stringify({ address }), {
              encrypt: false,
            })
            .then(() => afterSTXAddressPublished())
            .catch(r => {
              debugLog('STX address NOT published');
              debugLog(r);
              stxAddressSemaphore.putting = false;
            });
        });
      });
  }
}

export const finished =
  onDidConnect =>
  ({ userSession }) => {
    onDidConnect({ userSession });
    debugLog(userSession.loadUserData());

    const userData = userSession.loadUserData();
    const { address } = getStacksAccount(userData.appPrivateKey);
    debugLog(JSON.stringify({ address: addressToString(address) }));
    putStxAddress(userSession, addressToString(address));
  };
