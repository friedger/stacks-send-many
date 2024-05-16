# stacks-send-many

UI for send-many contract

## URL format

if you want to use a quick url, just add one or many recipient params like this:

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

Where recipient
