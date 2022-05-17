import { useAtom } from 'jotai';
import { ProfileFull } from './ProfileFull';
import { Address } from './Address';
import { NetworkIndicatorIcon } from './NetworkIndicatorIcon';
import { userBnsName, userLoggedIn, userStxAddress } from '../../store/stacks';
import { cityInfo, currentCity } from '../../store/cities';

export function ProfileSmall() {
  const [signedIn] = useAtom(userLoggedIn);
  const [ownerStxAddress] = useAtom(userStxAddress);
  const [ownerBnsName] = useAtom(userBnsName);
  const [current] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);

  if (signedIn) {
    return (
      <>
        <a
          className={`btn btn-primary-outline btn-lg ${
            current !== '' ? 'text-' + info[current].bgText : ''
          }`}
          data-bs-toggle="offcanvas"
          href="#offcanvasProfile"
          role="button"
          aria-controls="offcanvasProfile"
        >
          <NetworkIndicatorIcon />
          <Address bns={ownerBnsName} addr={ownerStxAddress} />
        </a>

        <ProfileFull />
      </>
    );
  }

  return null;
}
