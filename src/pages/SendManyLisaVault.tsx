import { useStxAddresses } from '../lib/hooks';

import { SendManyLisaTxGroup } from '../components/SendManyLisaTxGroup';

const cycles = [84, 83, 82, 81, 80];
const txs = {
  84: [
    '0xd45e090ac442380cf50655e3d1c904c355a501d6dffa3b5e4799083062469dbc',
    '0x3893753a2c407f0652729d30afa9cf7841f4669f3958523da73823f5c05a9e51',
  ],
  83: [
    '0xadf2bbc832ae0b4f256954232def116609366e1cdeef8f7a7067e1ef453c180b',
    '0x14f1df6257d8f9de4f862eb5763470783de86896da414ea4d0fa30bfa59340dc',
    '0x76bfd6994e7d1aa74693fca166f5f0299485f4ba918c30e7260a8c073296f36b',
  ],
  82: [
    '0x318e88d067276acab2ba7e9064588901fdf86228e0b818f674eee95d41d66701',
    '0xc7b6f645a940018194093b84ff5d3dff3f2a7110ab4a571e0c48170345967660',
  ],
  81: [
    '0xad1405990770d7020f5be5ea89270f2d78b6e6c3c3975f79d06545882fca10b2',
    '0x3c1cce237daaf526bfe0944dd4f1b4e6ae00bf0792376fab7b09c7d2b8fa22a5',
  ],
  80: ['0xb4b11df84fbc043a0c626fb6abd8d7b445f0b1cd6ef7d2104c0212a0248b1b67'],
};
type cyclesType = keyof typeof txs;
export default function SendManyLisaVault() {
  const { ownerStxAddress } = useStxAddresses();
  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">Lisa Vault</h1>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          {cycles.map((cycleId, index) => {
            return (
              <SendManyLisaTxGroup
                key={index}
                cycleId={cycleId}
                txList={txs[cycleId as cyclesType]}
                ownerStxAddress={ownerStxAddress}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
