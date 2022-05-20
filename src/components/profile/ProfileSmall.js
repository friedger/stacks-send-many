import { useAtom } from 'jotai';
import { ProfileFull } from './ProfileFull';
import { Address } from './Address';
import { NetworkIndicatorIcon } from './NetworkIndicatorIcon';
import { loginStatusAtom } from '../../store/stacks';
import { CITY_INFO, currentCityAtom } from '../../store/cities';

export function ProfileSmall() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [currentCity] = useAtom(currentCityAtom);

  if (loginStatus) {
    return (
      <>
        <a
          className={`btn btn-primary-outline btn-lg ${
            currentCity.loaded ? 'text-' + CITY_INFO[currentCity.data].bgText : ''
          }`}
          data-bs-toggle="offcanvas"
          href="#offcanvasProfile"
          role="button"
          aria-controls="offcanvasProfile"
        >
          <NetworkIndicatorIcon />
          <Address />
        </a>

        <ProfileFull />
      </>
    );
  }

  return null;
}
