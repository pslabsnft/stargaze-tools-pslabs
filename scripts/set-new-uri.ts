import { MsgExecuteContractEncodeObject, coins, toUtf8 } from 'cosmwasm';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { getClient } from '../src/client';
import { toStars } from '../src/utils';

const config = require('../config');

export async function setNewUri(uri: string, numTokens: string) {
  const client = await getClient();
  // let res = await client.queryContractSmart(config.minter, {
  //   config: {}
  // })
  // console.log(res)

  // res = await client.queryContractSmart(config.minter, {
  //   internal_info: {}
  // })
  // console.log(res)

  console.log('Minter contract: ', config.minter);
  console.log('New base URI: ', uri);
  console.log("num tokens: ", numTokens);

  const msg = { set_token_uri: { uri, num_tokens: parseInt(numTokens) } };
  console.log(JSON.stringify(msg, null, 2));

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    'auto',
    'mint to'
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

const args = process.argv.slice(2);

if (args.length < 4) {
  console.log('No arguments provided, need --uri and --num_tokens');
} else if (args.length == 4 && args[0] == '--uri' && args[2] == "--num-tokens") {
  setNewUri(args[1], args[3]);
} else {
  console.log('Invalid arguments');
}
