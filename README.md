# stacks-send-many

UI for sending tokens to many recipients at the same time using the `transfer-many` of the token contract or special `send-many` contracts.

## URL format

## Tokens

Each token has its own path like `https://sendstx.com/not`, `https://sendstx.com/sbtc`, etc.

For stx transfers use just `https://sendstx.com/`

## Chains

You can add `?chain=testnet` for transactions on testnet.

### Recipients

If you want to use a quick url, just add one or many recipient params like this:

```ts
const params = new URLSearchParams([
  ['recipient', 'SP1...MZ,1000,"thanks, love you"'],
  ['recipient', 'hz.btc,1000,"shokran"'],
  ['recipient', 'friedger.btc,1000,"danke"'],
  // you can always omit the memo and it will work as well
  ['recipient', 'nothing.btc,1000'],
]);

const sendSTXURL = `https://sendstx.com/not?${params.toString()}`;
// This produces
// https://sendstx.com/not?recipient=SP1...MZ%2C1000%2C%22thanks%2C+love+you%22&recipient=hz.btc%2C1000%2C%22shokran%22&recipient=friedger.btc%2C1000%2C%22danke%22
```
