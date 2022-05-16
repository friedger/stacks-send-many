import { useAtom } from 'jotai';
import { ProfileFull } from './ProfileFull';
import { Address } from './Address';
import { NetworkIndicatorIcon } from './NetworkIndicatorIcon';
import { userBnsName, userLoggedIn, userStxAddress } from '../../store/stacks';

export function ProfileSmall() {
  const [signedIn] = useAtom(userLoggedIn);
  const [ownerStxAddress] = useAtom(userStxAddress);
  const [ownerBnsName] = useAtom(userBnsName);

  if (signedIn) {
    return (
      <>
        <a
          className="btn btn-primary-outline btn-lg"
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
