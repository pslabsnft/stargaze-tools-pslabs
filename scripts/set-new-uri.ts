import { coins } from 'cosmwasm';
import { getClient } from '../src/client';

const config = require('../config');

export async function setNewUri(uri: string, numTokens: string) {
  const client = await getClient();

  console.log('Minter contract: ', config.minter);
  console.log('New base URI: ', uri);
  console.log("num tokens: ", numTokens);

  const msg = { set_token_uri: { uri, num_tokens: parseInt(numTokens) } };
  console.log(JSON.stringify(msg, null, 2));

  const paramsResponse = await client.queryContractSmart(
    config.serialPrintFactory,
    {
      params: {},
    }
  );
  console.log(paramsResponse);

  const creation_fee = parseInt(paramsResponse.params.extension.creation_fee_per_token) * parseInt(numTokens);
  const NEW_COLLECTION_FEE = coins(creation_fee, 'ustars');
  console.log(creation_fee)

  const result = await client.execute(
    config.account,
    config.minter,
    msg,
    'auto',
    'mint to',
    NEW_COLLECTION_FEE
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
