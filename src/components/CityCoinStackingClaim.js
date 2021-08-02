import React, { useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import {
  CC_NAME,
  CITYCOIN_CONTRACT_NAME,
  CITYCOIN_CONTRACT_NAME_TOKEN,
  CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  NETWORK,
  REWARD_CYCLE_LENGTH,
} from '../lib/constants';
import {
  uintCV,
  PostConditionMode,
  makeContractSTXPostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
  FungibleConditionCode,
  AnchorMode,
} from '@stacks/transactions';
import { getStackingState, getFirstStackingBlock } from '../lib/citycoin';

// TODO: how to know reward cycle to claim?
// get from a getter?

export function CityCoinStackingClaim({ ownerStxAddress }) {
  const [loading, setLoading] = useState();
  const [stackingState, setStackingState] = useState();
  const [firstStackingBlock, setFirstStackingBlock] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    getFirstStackingBlock().then(state => setFirstStackingBlock(state));
  }, [firstStackingBlock]);

  useEffect(() => {
    getStackingState(ownerStxAddress).then(state => setStackingState(state));
  }, [ownerStxAddress]);

  const claimAction = async (targetRewardCycleCV, amountUstxCV, amountCityCoinCV) => {
    setLoading(true);
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'claim-stacking-reward',
      functionArgs: [targetRewardCycleCV],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeContractSTXPostCondition(
          CONTRACT_ADDRESS,
          CITYCOIN_CONTRACT_NAME,
          FungibleConditionCode.LessEqual,
          amountUstxCV.value
        ),
        makeContractFungiblePostCondition(
          CONTRACT_ADDRESS,
          CITYCOIN_CONTRACT_NAME,
          FungibleConditionCode.LessEqual,
          amountCityCoinCV.value,
          createAssetInfo(TOKEN_CONTRACT_ADDRESS, CITYCOIN_CONTRACT_NAME_TOKEN, CC_NAME)
        ),
      ],
      anchorMode: AnchorMode.OnChainOnly,
      network: NETWORK,
      onCancel: () => {
        setLoading(false);
      },
      onFinish: result => {
        setLoading(false);
      },
    });
  };

  // TODO: add txstatus back to correlate with each claim button state

  return (
    <>
      <h3>Claim Stacking Rewards</h3>
      {stackingState && stackingState.length > 0 ? (
        <>
          <div className="accordion accordion-flush" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Reward Cycle #3
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>This is the first item's accordion body.</strong> It is shown by default,
                  until the collapse plugin adds the appropriate classes that we use to style each
                  element. These classes control the overall appearance, as well as the showing and
                  hiding via CSS transitions. You can modify any of this with custom CSS or
                  overriding our default variables. It's also worth noting that just about any HTML
                  can go within the <code>.accordion-body</code>, though the transition does limit
                  overflow.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Reward Cycle #2
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>This is the second item's accordion body.</strong> It is hidden by
                  default, until the collapse plugin adds the appropriate classes that we use to
                  style each element. These classes control the overall appearance, as well as the
                  showing and hiding via CSS transitions. You can modify any of this with custom CSS
                  or overriding our default variables. It's also worth noting that just about any
                  HTML can go within the <code>.accordion-body</code>, though the transition does
                  limit overflow.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Reward Cycle #1
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>This is the third item's accordion body.</strong> It is hidden by default,
                  until the collapse plugin adds the appropriate classes that we use to style each
                  element. These classes control the overall appearance, as well as the showing and
                  hiding via CSS transitions. You can modify any of this with custom CSS or
                  overriding our default variables. It's also worth noting that just about any HTML
                  can go within the <code>.accordion-body</code>, though the transition does limit
                  overflow.
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {stackingState.map((details, key) => (
              <div className="col-3 card" key={key}>
                <div className="card-header">Cycle {details.cycleId}</div>
                <div className="card-body">
                  <p>{(details.amountSTX / 1000000).toLocaleString()} STX</p>
                  <p>{details.amountCC.toLocaleString()} CityCoins</p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() =>
                      claimAction(
                        uintCV(details.cycleId),
                        uintCV(details.amountSTX),
                        uintCV(details.amountCC)
                      )
                    }
                  >
                    Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : loading ? null : (
        <div className="my-2">
          <p>Coming soon!</p>
          <p>
            Stacking becomes available at Block #{firstStackingBlock}, and the first claims can be
            made at Block #{firstStackingBlock + REWARD_CYCLE_LENGTH}.
          </p>
        </div>
      )}
    </>
  );
}
