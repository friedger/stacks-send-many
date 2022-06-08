import { useConnect } from '@stacks/connect-react';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  PostConditionMode,
  uintCV,
} from '@stacks/transactions';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isStringAllDigits } from '../../lib/common';
import { fromMicro, STACKS_NETWORK, toMicro } from '../../lib/stacks';
import {
  CITY_CONFIG,
  CITY_INFO,
  currentCityAtom,
  currentRewardCycleAtom,
  stackingStatsPerCityAtom,
} from '../../store/cities';
import { stxAddressAtom, userBalancesAtom } from '../../store/stacks';
import CurrentRewardCycle from '../common/CurrentRewardCycle';
import FormResponse from '../common/FormResponse';
import LoadingSpinner from '../common/LoadingSpinner';
import DocumentationLink from '../common/DocumentationLink';
import StackingStats from '../dashboard/StackingStats';

export default function StackCityCoins() {
  const { doContractCall } = useConnect();

  const [stxAddress] = useAtom(stxAddressAtom);
  const [currentRewardCycle] = useAtom(currentRewardCycleAtom);
  const [currentCity] = useAtom(currentCityAtom);
  const [stackingStatsPerCity] = useAtom(stackingStatsPerCityAtom);
  const [balances] = useAtom(userBalancesAtom);

  const [loading, setLoading] = useState(false);
  const [formMsg, setFormMsg] = useState({
    type: 'light',
    hidden: true,
    text: '',
    txId: '',
  });

  const amountRef = useRef();
  const cyclesRef = useRef();

  const symbol = useMemo(() => {
    return currentCity.loaded ? CITY_INFO[currentCity.data].symbol : undefined;
  }, [currentCity.loaded, currentCity.data]);

  const cityStackingStats = useMemo(() => {
    if (currentCity.loaded) {
      const key = currentCity.data;
      if (stackingStatsPerCity[key]) {
        return stackingStatsPerCity[key];
      }
    }
    return undefined;
  }, [currentCity.loaded, currentCity.data, stackingStatsPerCity]);

  useEffect(() => {
    // reset state
    setLoading(false);
    setFormMsg({
      type: 'light',
      hidden: true,
      text: '',
      txId: '',
    });
    amountRef.current.value = undefined;
    cyclesRef.current.value = undefined;
  }, [currentCity.data]);

  const stackingPrep = async () => {
    const amount = +amountRef.current.value;
    const cycles = +cyclesRef.current.value;
    // reset state
    setLoading(true);
    setFormMsg({
      type: 'light',
      hidden: true,
      text: '',
      txId: '',
    });
    // check if balances are loaded
    if (!balances.loaded) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Balances not loaded. Please try again or refresh.',
      });
      return;
    }
    // check if amount is valid
    const balance = +balances.data[currentCity.data]['v2'];
    if (isNaN(amount) || !isStringAllDigits(amount) || amount <= 0 || toMicro(amount) > balance) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: `Please enter a valid amount to stack. Current balance: ${fromMicro(
          balances.data[currentCity.data]['v2']
        ).toLocaleString()} ${symbol}`,
      });
      setLoading(false);
      return;
    }
    // check if cycles are valid
    if (isNaN(cycles) || !isStringAllDigits(cycles) || cycles <= 0 || cycles > 32) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Please enter a valid number of cycles (1-32).',
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
    await stack(amount, cycles);
  };

  const stack = async (amount, cycles) => {
    const amountCV = uintCV(toMicro(amount));
    const cyclesCV = uintCV(cycles);
    const version = CITY_INFO[currentCity.data].currentVersion;
    await doContractCall({
      contractAddress: CITY_CONFIG[currentCity.data][version].deployer,
      contractName: CITY_CONFIG[currentCity.data][version].core.name,
      functionName: 'stack-tokens',
      functionArgs: [amountCV, cyclesCV],
      network: STACKS_NETWORK,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardFungiblePostCondition(
          stxAddress.data,
          FungibleConditionCode.Equal,
          amountCV.value,
          createAssetInfo(
            CITY_CONFIG[currentCity.data][version].deployer,
            CITY_CONFIG[currentCity.data][version].token.name,
            CITY_CONFIG[currentCity.data][version].token.tokenName
          )
        ),
      ],
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
          text: `Stacking transaction successfully sent.`,
          txId: result.txId,
        });
      },
    });
  };

  const max = async () => {
    if (!balances.loaded) {
      setFormMsg({
        type: 'danger',
        hidden: false,
        text: 'Balances not loaded. Please try again or refresh.',
      });
      return;
    }
    amountRef.current.value = fromMicro(balances.data[currentCity.data]['v2']);
  };

  return (
    <div className="container-fluid p-6">
      <h3>
        {`Stacking ${symbol ? symbol : 'CityCoins'}`}{' '}
        <DocumentationLink docLink="https://docs.citycoins.co/core-protocol/stacking-citycoins"/>
      </h3>
      <CurrentRewardCycle symbol={symbol} />
      <p>
        Stacking CityCoins locks up {symbol} in the contract for a selected number of reward cycles
        in return for a portion of the STX sent by miners.
      </p>
      <p>
        For more information on Stacking, please read the{' '}
        <a
          href="https://docs.citycoins.co/citycoins-core-protocol/stacking-citycoins#common-questions"
          target="_blank"
          rel="noreferrer"
        >
          common questions in the documentation
        </a>
        .
      </p>
      {cityStackingStats.updating ? (
        <LoadingSpinner text={`Loading stacking data`} />
      ) : (
        cityStackingStats.data.map(value => (
          <StackingStats key={`stats-${value.cycle}`} stats={value} />
        ))
      )}
      <div class="container-fluid">
        <div class="row flex-col bg-secondary rounded-3 p-3 mt-3">
          <div class="col-lg-6">
            <p className="fs-4 fw-bold mt-3">Some quick notes:</p>
            <ul>
              <li>{symbol} are transferred to the contract while Stacking</li>
              <li>STX rewards can be claimed after each cycle ends</li>
              <li>Stacked {symbol} can be claimed after the selected period ends</li>
              <li>
                Stacking always occurs in the <span className="fst-italic">next reward cycle</span>
              </li>
              <li>Stackers must skip one cycle after the selected period ends</li>
            </ul>
          </div>
          <div class="col">
            <h4 className="mt-3">{`Stack ${symbol} in Cycle ${currentRewardCycle.data + 1}`}</h4>
            <form>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  ref={amountRef}
                  aria-label={`Amount in ${symbol}`}
                  placeholder={`Amount in ${symbol}`}
                  required
                  minLength="1"
                />
                <span className="input-group-text">{symbol}</span>
                <button className="btn btn-sm btn-primary ms-3" type="button" onClick={max}>
                  MAX
                </button>
              </div>
              <div className="input-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  ref={cyclesRef}
                  aria-label="Number of Reward Cycles"
                  placeholder="Number of Reward Cycles"
                  required
                  max="32"
                  minLength="1"
                />
              </div>
              <button className="btn btn-block btn-primary" type="button" onClick={stackingPrep}>
                {loading ? <LoadingSpinner text="Stacking..." /> : 'Stack'}
              </button>
            </form>
            <br />
            <FormResponse {...formMsg} />
          </div>
        </div>
      </div>
    </div>
  );
}
