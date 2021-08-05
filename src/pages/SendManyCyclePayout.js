import React from 'react';
import { SendManyGroupTxs } from '../components/SendManyGroupTxs';
import { chainSuffix } from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';

const cycles = {
  3: ['0xb855ff8858f6942dbc80815b4b143bb5f880f8d293e0871be492cf2c2c506397'],
  4: [
    '0x267d42288692908ee4eb54b54534dfecf62c69b3d6863897d679920aba1369ab',
    '0x329b7709253e964828509995028f98c295e3524c82275e6220d94964e2cc751a',
  ],
  5: [
    '0xa0d55e253db024eefaa43abf940760e2b1a97dd16d3251fee24f27a6632716bf',
    '0x2d5a2e0256ea9d3cd536ab4c4cf7875a0c2e1031f80b2bb3fd37fa160aa293f0',
    '0x5a42ebdce2f7e8474c91d382eadaad3e8fee026c9360bfd5e3f57dc6a6255f7f',
  ],
  6: [
    '0x5a8aceb985db569edc5cee79eea254fb9b0b241f2ae29dd6d0b4772132a34448',
    '0xebc0c7cdd5b0719b8abd155e2666fca0f7477e5085991242e72e5996ab9da004',
    '0x728ddb8092dc249e0233e184354b07e2ba29d2bc1cdac3be624ea1e63487420f',
    '0xb568822115b4e20cea0de761a90afbb18aeabaa116b98922ff6bf8d821603ba5',
  ],
  7: [
    '0x31249d6f68a341f0d4a214c2cdb837ca03248614631be33403a3687117d4c893',
    '0xdbde04abacc322a7bacbb91c421998c844c1238f3ca42102ecdcf70b177e82b9',
    '0x6c24ba278eb14cf271588bf9e98b2855bc14b0263988c3ef479c41c2d581dbaa',
    '0xd14c641281eeb11da1329d9b9e488710f20959c15d276b7400ceb10e1b3c0a14',
    '0x6c0029aa859d719d65b635eadfae28b2e941c91000df0a49e5d7034268eab755',
  ],
  8: [
    '0x273fc0b873c4ec7b78064b33251de8b1f358bfcb260ca0691541b2dd5b36a9a2',
    '0xb4e9ce8ade0dd0f1539c6b55b175e530a499f963793a240a12c856a105341710',
    '0x3f51493034a6962430cb8f728612bb8ef221342fc6658633705c2e756a426cd7',
    '0x7dd6e079036232a5e832a0516f2bf87c9edbd97683f4ac16649f9d0e41aeca03',
    '0xa81402d4cf2d8e3d42b42066c5cd7c30eb642d24c1799c2d5f37449fb38bc343',
  ],
  9: [
    '0xe0cf9f52dbe8046afb22a6edf607dc5aed9eb746270454cc3618142bd5280624',
    '0x18826e3b307228b90fd76db5eba3270a5f24e0e994d00891f6bf480511374967',
    '0x31025d981f49257c17a7131fc54e729911ba7926d7df10d2bde70fec71bd064f',
    '0xe99e912ce96ecb8836ffcd64638c71476ad52062980294ebc675411ce78d6fe6',
    '0xc3a251dcadd0d7ae0520a15484249794f215da4ba7bd77f7449d74083e725afb',
    '0x2b4c19dac2e4f5e97a127b1f06d45fb9fb21e7331c1fca33b110689e1ca91fe9',
  ],
  10: [
    '0xdba0b81cabd6e128d873d69035684ea8ee70309c9a1be531e22e5e5d8cc38ec0',
    '0xef211166b62b78b426514da661531be77dcaed83c68b0c1d554c27fa89c64c4c',
    '0x2953fb87c706215b287e59637e96895ef3267d623e61c9f6c4dc601b53232e7c',
    '0xe8bbf18f0af1a449e55856e613ffd9604e55fe0ce23e01921f7eecde594b8f32',
    '0x1675a371920b9e6571a12bfde836eb6c48f9b95eff3d37c521132b4f8ee865c2',
    '0x512228d7ebbfe6bff5f85d486d694e8b04ad50000d3295269834f616a546f888',
    '0x91537ef4e1af7f2a76fc73402ef7f110f1539cf5e3b2d44d1d0f9e7944f59501',
    '0x3288bfffff01a4558f6942ec46de203227ae3527aaca6b416e58e07e501e4ead',
    '0xd56bbdf13f71750fc205bb4b29fbac73ad25c6287e405f003ce77883f587136d',
    '0x7c955d125242829cfc837faa7037009841c826bf5a0ee85e91acbad6ae4ff800',
    '0x2ad058eb5b6ae13bca6fa6b49824e3869b6b844e494e53a4f4b40a36e225b4ef',
    '0xcd1b882dfe45827f912e499cd53d5a093842a036e5cdc4c50fd80f7354605016',
  ],
  11: [
    '0x8594addc0d2777d7e980946d65cd311cedd4034e350abc08e14281d3830ea178',
    '0xb599b06588b2ac74f1a1f6a55d26aed0d12b5b9a56b5eb9113633d6ef1c19b01',
    '0x28c20a9f2875d38407df1db67c3a108d8a64e9e2c484f203343455f3ba45b739',
    '0xf1e4045487d10598bd1c92237a25f360421ae3eb883e3d82f4cd7032b65f9175',
    '0xe037bc0fde7dc07eed152f630a2fcef2a054eaf0b0faaba71e16ac742bdf6e5f',
    '0xd967b3cc5966c4055a7bd554d6bb8ff08d07ef6e48d8603eb7c59375b05e7e78',
    '0x7e7ab09d52c6eee115031244dad9351e8f6ac3ad4c2fdd035be218f6192d3741',
    '0xdccc31167069bd8062b186429820ea40f8aeec363f688fbc0115a02f8eccd893',
    '0xac947f16eceee54f8c00362418ad9f53ff7c9817f6624cd354bd8ff47435f1ab',
    '0x25eb0d56d938dc82528d276c06a0733ca1d88c348a68923744a83ef7cb6d407a',
  ],
  12: [
    '0x6fe03ca2fee1c65dbe39e5f55a6676f83715f24120cf77c0b3c4a937a02122e6',
    '0x3f72452845a0cc7eaf68ff2788fc02804e4e9c37f950f4a9f15da34a74ef99f4',
    '0x727babbb1449a072b650e64306eeea9498f14e66e03e3c6fb58930f112f74c60',
    '0xeaa828b0ef9ac6a886dcff996c2a79b7fdfc8a5c3e7691ace3012dd13f99012f',
    '0x9a2ec256bf49cfe1a61f5453380f3436b28b4128a4c47250d5f4bbe73f90bd32',
    '0x962ace19ba328ffaddde2d3f5bebbdc7a0183e1dcf73ba253c639df71d722ff4'
  ],
  13: [
    '0x4fa6a0cf0d65153bc54fda06325277584bf88c29d2c5892e1982c6a5e0c619a7',
    '0x0867408637e7fc0f8c972dbd360ff44fe40bd51fef66f98ada8b2e2d8242d6d2',
    '0x56f914b4e34802d8b2c86b226468066f13e4227597477fc51b6ff5ea8277de28',
    '0x6e5f642fa0e91ee986c0b8c7715ff7f3030e1ca6a3b7929ea1e37fdfda5ff41d',
    '0x20c024ed50a2417c3fb456a71d0ac7e8a4ef10a6ca1fccb408a236d774b86e05',
    '0x03765abfaa7b140b06199addfe7ad7201e461ca0905ff94a58cea5fdb57e0f76',
  ],
};
export default function SendManyDetails({ userSession, cycleId }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">Send-Many Transaction</h1>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          {cycles[cycleId] ? (
            <SendManyGroupTxs
              txList={cycles[cycleId]}
              ownerStxAddress={ownerStxAddress}
              userSession={userSession}
            />
          ) : (
            <>
              Not found! Cycle #{cycleId} wasn't paid out will be only in the future.
              <br />
              Payout data available for cylces:{' '}
              {Object.keys(cycles).map(cycleId => (
                <>
                  <a href={`/cycle/${cycleId}${chainSuffix}`}>#{cycleId}</a>{' '}
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
