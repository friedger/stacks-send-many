import { useMemo, useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { useAtom } from 'jotai';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import FormResponse from '../common/FormResponse';
import LoadingSpinner from '../common/LoadingSpinner';
import DocumentationLink from '../common/DocumentationLink';
import { currentStacksBlockAtom, stxAddressAtom } from '../../store/stacks';
import { CITY_CONFIG, CITY_INFO, currentCityAtom } from '../../store/cities';
import { canClaimMiningReward, isBlockWinner } from '../../lib/citycoins';
import { uintCV } from '@stacks/transactions';
import { STACKS_NETWORK } from '../../lib/stacks';

export default function ClaimMiningRewards() {
  const { doContractCall } = useConnect();
  const [stxAddress] = useAtom(stxAddressAtom);
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const [loading, setLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({
    type: 'light',
    hidden: true,
    text: '',
    txId: '',
  });

  const symbol = useMemo(() => {
    return currentCity.loaded ? CITY_INFO[currentCity.data].symbol : undefined;
  }, [currentCity.loaded, currentCity.data]);

  const blockHeightRef = useRef();

  const claimPrep = async () => {
    const block = +blockHeightRef.current.value;
    // reset state
    setLoading(true);
    setFormMsg({
      type: 'light',
      hidden: true,
      text: '',
      txId: '',
    });
    // current stacks block must be loaded
    if (!currentStacksBlock.loaded) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Stacks block not loaded. Please try again or refresh.',
      });
      setLoading(false);
      return;
    }
    // stx address must be loaded
    if (!stxAddress.loaded) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Stacks address not loaded. Please try again or refresh.',
      });
      setLoading(false);
      return;
    }
    // no empty values
    if (block === '') {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Please enter a block height to claim.',
      });
      setLoading(false);
      return;
    }
    // no claiming before mature
    if (block > currentStacksBlock.data - 100) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Cannot claim, the winner is not known until 100 blocks pass.',
      });
      setLoading(false);
      return;
    }
    // select target version based on block height
    const version = await selectCityVersion(block);
    console.log(`version: ${version}`);
    if (!version) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Cannot find city version for block height.',
      });
      setLoading(false);
      return;
    }
    // verify user is winner at block height
    const winner = await isBlockWinner(version, currentCity.data, block, stxAddress.data);
    if (winner) {
      setFormMsg({
        type: 'success',
        hidden: false,
        text: 'Winner at block height, checking if reward claimed.',
      });
    } else {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Cannot claim, did not win at the selected block height.',
      });
      setLoading(false);
      return;
    }
    // verify user can claim mining reward
    const canClaim = await canClaimMiningReward(version, currentCity.data, block, stxAddress.data);
    if (canClaim) {
      setFormMsg({
        type: 'success',
        hidden: false,
        text: 'Can claim reward, sending claim transaction.',
      });
    } else {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Cannot claim, reward already claimed.',
      });
      setLoading(false);
      return;
    }
    // submit mining claim transaction
    await claimReward(version, block);
  };

  const claimReward = async (version, block) => {
    const targetBlockCV = uintCV(block);
    await doContractCall({
      contractAddress: CITY_CONFIG[currentCity.data][version].deployer,
      contractName: CITY_CONFIG[currentCity.data][version].core.name,
      functionName: 'claim-mining-reward',
      functionArgs: [targetBlockCV],
      network: STACKS_NETWORK,
      onCancel: () => {
        setLoading(false);
        setFormMsg({
          type: 'warning',
          hidden: false,
          text: 'Transaction was canceled, please try again.',
        });
      },
      onFinish: result => {
        setLoading(false);
        setFormMsg({
          type: 'success',
          hidden: false,
          text: `Claim transaction succesfully sent for block ${block.toLocaleString()}.`,
          txId: result.txId,
        });
      },
    });
  };

  const selectCityVersion = async block => {
    return CITY_INFO[currentCity.data].versions.reduce((prev, curr) => {
      const startBlock = CITY_CONFIG[currentCity.data][curr].core.startBlock;
      const shutdown = CITY_CONFIG[currentCity.data][curr].core.shutdown;
      const shutdownBlock = shutdown
        ? CITY_CONFIG[currentCity.data][curr].core.shutdownBlock
        : undefined;
      if (block < startBlock) return prev;
      if (shutdown && block < shutdownBlock) return curr;
      if (!shutdown) return curr;
      return undefined;
    }, undefined);
  };

  return (
    <div className="container-fluid p-6">
      <h3>
        {`Claim ${symbol ? symbol + ' ' : ''}Mining Rewards`}{' '}
        <DocumentationLink docLink="https://docs.citycoins.co/core-protocol/mining-citycoins" />
      </h3>
      <CurrentStacksBlock />
      <p>
        The winner for a block can be queried after 100 blocks pass (~16-17hrs), and the winner can
        claim newly minted {symbol}.
      </p>
      <p>
        There is only one winner per block, and STX sent to the contract for mining are not
        returned.
      </p>
      <form>
        <div className="form-floating">
          <input
            className="form-control"
            placeholder="Block Height to Claim?"
            ref={blockHeightRef}
            id="blockHeightRef"
          />
          <label htmlFor="blockHeightRef">Block Height to Claim?</label>
        </div>
        <button className="btn btn-block btn-primary my-3" type="button" onClick={claimPrep}>
          {loading ? <LoadingSpinner text="Claim Mining Reward" /> : 'Claim Mining Reward'}
        </button>
      </form>
      <FormResponse {...formMsg} />
    </div>
  );
}
