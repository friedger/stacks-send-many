import { useAtom } from 'jotai';
import { ProfileFull } from './ProfileFull';
import { Address } from './Address';
import { NetworkIndicatorIcon } from './NetworkIndicatorIcon';
import { stxBnsNameAtom, loginStatusAtom, stxAddressAtom } from '../../store/stacks';
import { CITY_INFO, currentCityAtom } from '../../store/cities';

export function ProfileSmall() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [stxAddress] = useAtom(stxAddressAtom);
  const [bnsName] = useAtom(stxBnsNameAtom);
  const [currentCity] = useAtom(currentCityAtom);

  if (loginStatus) {
    return (
      <>
        <a
          className={`btn btn-primary-outline btn-lg ${
            currentCity !== '' ? 'text-' + CITY_INFO[currentCity].bgText : ''
          }`}
          data-bs-toggle="offcanvas"
          href="#offcanvasProfile"
          role="button"
          aria-controls="offcanvasProfile"
        >
          <NetworkIndicatorIcon />
          <Address bns={bnsName} addr={stxAddress} />
        </a>

        <ProfileFull />
      </>
    );
  }

  return null;
}
