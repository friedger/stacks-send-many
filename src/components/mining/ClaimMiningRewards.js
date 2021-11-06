import { useConnect } from '@stacks/connect-react';
import { useRef, useState } from 'react';
import { currentBlockHeight } from '../../store/common';
import { canClaimMiningReward, isBlockWinner } from '../../lib/citycoins';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import { useAtom } from 'jotai';
import { useStxAddresses } from '../../lib/hooks';
import { userSessionState } from '../../lib/auth';
import LoadingSpinner from '../common/LoadingSpinner';
import { uintCV } from '@stacks/transactions';
import { NETWORK } from '../../lib/stacks';

export default function ClaimMiningRewards(props) {
  const { doContractCall } = useConnect();

  const singleBlockRef = useRef();

  const [loading, setLoading] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);

  const [blockHeight] = useAtom(currentBlockHeight);

  const checkWinner = async () => {
    // check if we can claim
    setLoading(true);

    if (singleBlockRef.current.value === '') {
      setErrorMsg('Please enter a block height to check');
      setLoading(false);
    } else if (blockHeight - singleBlockRef.current.value < 100) {
      setErrorMsg('Please wait for 100 blocks to pass before checking.');
      setLoading(false);
    } else if (singleBlockRef.current.value > blockHeight) {
      setErrorMsg('Please select a block height in the past.');
      setLoading(false);
    } else {
      setSuccessMsg('');
      setErrorMsg('');
      isBlockWinner(
        props.contracts.deployer,
        props.contracts.coreContract,
        ownerStxAddress,
        singleBlockRef.current.value
      ).then(result => {
        console.log(`isBlockWinner; ${JSON.stringify(result)}`);
        if (result.value) {
          setSuccessMsg(`Won block ${singleBlockRef.current.value}, checking if claimed...`);
          canClaimMiningReward(
            props.contracts.deployer,
            props.contracts.coreContract,
            ownerStxAddress,
            singleBlockRef.current.value
          ).then(result => {
            console.log(`canClaimMiningReward; ${JSON.stringify(result)}`);
            setCanClaim(result.value);
            result.value
              ? setSuccessMsg(
                  `Won block ${singleBlockRef.current.value}, eligible to claim rewards.`
                )
              : setSuccessMsg(`Won block ${singleBlockRef.current.value}, reward already claimed!`);
            setLoading(false);
          });
        } else {
          setSuccessMsg(`Did not win block ${singleBlockRef.current.value}.`);
          setLoading(false);
        }
      });
    }
  };

  const claimRewards = async () => {
    // claim the rewards
    setLoadingClaim(true);
    const targetBlockCV = uintCV(singleBlockRef.current.value);
    await doContractCall({
      contractAddress: props.contracts.deployer,
      contractName: props.contracts.coreContract,
      functionName: 'claim-mining-reward',
      functionArgs: [targetBlockCV],
      network: NETWORK,
      onCancel: () => {
        setLoadingClaim(false);
        setErrorMsg('Transaction cancelled.');
      },
      onFinish: result => {
        setLoadingClaim(false);
        setErrorMsg('');
        setSuccessMsg(
          `Claimed rewards for block ${singleBlockRef.current.value}.\n\nTXID: ${result.txId}`
        );
      },
    });
  };

  return (
    <div className="container-fluid p-6">
      <h3>
        Claim Mining Rewards{' '}
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/claiming-mining-rewards"
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </h3>
      <CurrentStacksBlock />
      <p>
        The winner for a block can be queried after 100 blocks pass (~16-17hrs), and the winner can
        claim newly minted MIA.
      </p>
      <p>
        There is only one winner per block, and STX sent to the contract for mining are not
        returned.
      </p>
      <form>
        <div className="form-floating">
          <input
            className="form-control"
            placeholder="Block Height?"
            ref={singleBlockRef}
            id="singleBlockHeight"
          />
          <label htmlFor="singleBlockHeight">Block Height?</label>
        </div>
        <button className="btn btn-block btn-primary my-3 me-3" type="button" onClick={checkWinner}>
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top ms-1 me-2`}
          />
          Check if Winner
        </button>
        <button
          className="btn btn-block btn-primary my-3"
          type="button"
          disabled={!canClaim}
          onClick={claimRewards}
        >
          <div
            role="status"
            className={`${
              loadingClaim ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top ms-1 me-2`}
          />
          Claim Rewards
        </button>
      </form>
      {successMsg ? <p>{successMsg}</p> : loading && <LoadingSpinner />}
      {errorMsg ? <p className="text-danger">{errorMsg}</p> : null}
    </div>
  );
}
