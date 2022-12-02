import { getClient } from '../src/client';

const config = require('../config');

export async function setMintable(mintable: string) {
  const client = await getClient();

  console.log('Minter contract: ', config.minter);
  console.log('Mintable: ', mintable);

  let can_mint = mintable.toLowerCase() == "true"? true: false;
  const msg = { set_mintable: { can_mint } };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    'auto',
    'set mintable'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
  if (wasmEvent != undefined) {
    console.info(wasmEvent);
  }
}

console.log(process.argv)
const args = process.argv.slice(2);
console.log(args)
if (args.length < 2) {
  console.log('No arguments provided, need --can-mint');
} else if (args.length == 2 && args[0] == '--can-mint') {
  setMintable(args[1]);
} else {
  console.log('Invalid arguments');
}
