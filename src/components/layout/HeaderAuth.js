import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { getUserData } from '@stacks/connect';
import { getStacksAccount } from '../../lib/account';
import { useConnect, userSessionStateAtom } from '../../lib/auth';
import { getBnsName, getStxBalance, isMainnet } from '../../lib/stacks';
import {
  loginStatusAtom,
  stxAddressAtom,
  appStxAddressAtom,
  stxBnsNameAtom,
  userBalancesAtom,
} from '../../store/stacks';
import { ProfileSmall } from '../profile/ProfileSmall';
import { CITY_INFO, currentCityAtom } from '../../store/cities';
import { getCCBalance } from '../../lib/citycoins';

export default function HeaderAuth() {
  const { handleOpenAuth } = useConnect();
  const [userSessionState] = useAtom(userSessionStateAtom);
  const [loginStatus] = useAtom(loginStatusAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const setStxAddress = useUpdateAtom(stxAddressAtom);
  const setAppStxAddress = useUpdateAtom(appStxAddressAtom);
  const setBnsName = useUpdateAtom(stxBnsNameAtom);
  const setUserBalances = useUpdateAtom(userBalancesAtom);

  useEffect(() => {
    const fetchUserData = async () => {
      if (loginStatus) {
        const userData = await getUserData(userSessionState);
        const stxAddress = userData.profile.stxAddress[isMainnet ? 'mainnet' : 'testnet'];
        setStxAddress({ loaded: true, data: stxAddress });
        const { appStxAddress } = getStacksAccount(userData.appPrivateKey);
        setAppStxAddress({ loaded: true, data: appStxAddress });
      } else {
        setStxAddress({ loaded: false, data: '' });
        setAppStxAddress({ loaded: false, data: '' });
        setBnsName({ loaded: false, data: '' });
      }
    };

    const fetchBnsName = async stxAddress => {
      const bnsName = await getBnsName(stxAddress).catch(() => undefined);
      bnsName
        ? setBnsName({ loaded: true, data: bnsName })
        : setBnsName({ loaded: false, data: '' });
    };

    const fetchUserBalances = async stxAddress => {
      const stxBalance = getStxBalance(stxAddress);
      const miaBalanceV1 = getCCBalance('v1', 'mia', stxAddress);
      const miaBalanceV2 = getCCBalance('v2', 'mia', stxAddress);
      const nycBalanceV1 = getCCBalance('v1', 'nyc', stxAddress);
      const nycBalanceV2 = getCCBalance('v2', 'nyc', stxAddress);
      Promise.all([stxBalance, miaBalanceV1, miaBalanceV2, nycBalanceV1, nycBalanceV2]).then(
        values => {
          const balances = {
            stx: values[0],
            mia: {
              v1: values[1],
              v2: values[2],
            },
            nyc: {
              v1: values[3],
              v2: values[4],
            },
          };
          setUserBalances({ loaded: true, data: balances });
        }
      );
    };

    fetchUserData().then(stxAddress => {
      if (stxAddress) {
        fetchBnsName(stxAddress).catch(err => {
          console.error(`${err.message} Failed to fetch BNS name`);
        });
        fetchUserBalances(stxAddress).catch(err => {
          console.error(`${err.message} Failed to fetch user balances`);
        });
      }
    });
  }, [loginStatus, userSessionState, setStxAddress, setAppStxAddress, setBnsName, setUserBalances]);

  if (loginStatus) return <ProfileSmall />;

  return (
    <button
      className={`btn btn-md ${
        currentCity.loaded
          ? 'btn-outline-' + CITY_INFO[currentCity.data].bgText
          : 'btn-outline-primary'
      }`}
      type="button"
      onClick={handleOpenAuth}
    >
      Connect Wallet
    </button>
  );
}
