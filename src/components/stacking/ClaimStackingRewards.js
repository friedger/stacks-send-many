import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { Fragment, useMemo, useRef, useState } from 'react';
import { getStackerAtCycle, getStackingReward } from '../../lib/citycoins';
import {
  CITY_INFO,
  currentCityAtom,
  currentRewardCycleAtom,
  rewardCyclesToClaimAtom,
  userIdAtom,
} from '../../store/cities';
import { currentStacksBlockAtom } from '../../store/stacks';
import CurrentRewardCycle from '../common/CurrentRewardCycle';
import FormResponse from '../common/FormResponse';
import LoadingSpinner from '../common/LoadingSpinner';
import DocumentationLink from '../common/DocumentationLink';
import StackingReward from './StackingReward';

export default function ClaimStackingRewards() {
  const [userIds] = useAtom(userIdAtom);
  const [currentStacksBlock] = useAtom(currentStacksBlockAtom);
  const [currentRewardCycle] = useAtom(currentRewardCycleAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const [rewardCyclesToClaim, setRewardCyclesToClaim] = useAtom(rewardCyclesToClaimAtom);
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

  const rewardCycleRef = useRef();

  const claimPrep = async () => {
    const cycle = +rewardCycleRef.current.value;
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
    // user IDs must be loaded
    if (!userIds.loaded) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'User IDs not loaded. Please try again or refresh.',
      });
      setLoading(false);
      return;
    }
    // current reward cycle must be loaded
    if (!currentRewardCycle.loaded) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Reward cycle not loaded. Please try again or refresh.',
      });
      setLoading(false);
      return;
    }
    // no empty values
    if (cycle === '') {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Please enter a reward cycle to claim.',
      });
      setLoading(false);
      return;
    }
    // warn if claiming during/after current cycle
    if (cycle >= currentRewardCycle.data) {
      setFormMsg({
        type: 'warning',
        hidden: false,
        text: `Reward cycle is in the future. Rewards will show 0 for the current version (${
          CITY_INFO[currentCity.data].currentVersion
        }) of the contract.`,
      });
    }
    // get claim amounts for each version
    CITY_INFO[currentCity.data].versions.map(async version => {
      const { stxReward, toReturn } = await getClaimAmounts(cycle, version);
      // add to array used for display
      setRewardCyclesToClaim(prev => {
        let newClaims = { ...prev };
        // make sure all object keys exist, could
        // generalize as createNestedObject in common
        if (!newClaims.hasOwnProperty(currentCity.data)) newClaims[currentCity.data] = {};
        if (!newClaims[currentCity.data].hasOwnProperty(cycle))
          newClaims[currentCity.data][cycle] = {};
        if (!newClaims[currentCity.data][cycle].hasOwnProperty(version))
          newClaims[currentCity.data][cycle][version] = {};
        // add new value to existing
        let newClaimsValue = { ...newClaims };

        newClaimsValue[currentCity.data][cycle][version] = {
          stxReward: stxReward,
          toReturn: toReturn,
        };
        return newClaimsValue;
      });
    });
    setLoading(false);
  };

  const getClaimAmounts = async (cycle, version) => {
    let stxReward = 0;
    let toReturn = 0;
    // check if ID is found with version
    const id = userIds.data[currentCity.data][version] ?? undefined;
    if (id) {
      // get reward amount
      stxReward = await getStackingReward(version, currentCity.data, cycle, id);
      // get CityCoins to return
      const stacker = await getStackerAtCycle(version, currentCity.data, cycle, id);
      toReturn = stacker.toReturn;
    }
    return { stxReward: stxReward, toReturn: toReturn };
  };

  return (
    <div className="container-fluid p-6 mb-3">
      <h3>
        {`Claim ${symbol ? symbol + ' ' : ''}Stacking Rewards`}{' '}
        <DocumentationLink docLink="https://docs.citycoins.co/core-protocol/stacking-citycoins" />
      </h3>
      <CurrentRewardCycle />
      <p>
        When a reward cycle is complete, Stackers can claim their portion of the STX committed by
        miners.
      </p>
      <p>
        When the last selected cycle is complete, Stackers can claim their {symbol} back in the same
        transaction.
      </p>
      <form>
        <div className="form-floating">
          <input
            className="form-control"
            placeholder="Check Reward Cycle"
            ref={rewardCycleRef}
            id="rewardCycleRef"
          />
          <label htmlFor="rewardCycleRef">Reward Cycle to Check?</label>
        </div>
        <button className="btn btn-block btn-primary my-3 me-3" type="button" onClick={claimPrep}>
          {loading ? <LoadingSpinner text="Check Reward Cycle" /> : 'Check Reward Cycle'}
        </button>
        <button
          className="btn btn-block btn-primary my-3"
          type="button"
          onClick={() => setRewardCyclesToClaim(RESET)}
        >
          Clear Data
        </button>
      </form>
      <FormResponse {...formMsg} />
      {rewardCyclesToClaim[currentCity.data] &&
        Object.values(rewardCyclesToClaim[currentCity.data]).map((cycleData, cycleIndex) => {
          return Object.values(cycleData).map((versionData, versionIndex) => {
            const cycle = Object.keys(rewardCyclesToClaim[currentCity.data])[cycleIndex];
            const version = Object.keys(cycleData)[versionIndex];
            return (
              <Fragment key={`${currentCity.data}-${cycle}-${version}`}>
                <StackingReward version={version} cycle={cycle} data={versionData} />
              </Fragment>
            );
          });
        })}
    </div>
  );
}
