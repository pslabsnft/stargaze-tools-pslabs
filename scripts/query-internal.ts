import { CosmWasmClient } from 'cosmwasm';
import { toStars } from '../src/utils';

const config = require('../config');

async function queryInfo() {
  const client = await CosmWasmClient.connect(config.rpcEndpoint);
  const account = toStars(config.account);
  const minter = toStars(config.minter);
  const sg721 = toStars(config.sg721);

  const configResponse = await client.queryContractSmart(minter, {
    internal_info: {},
  });
  console.log('minter internal info: ', configResponse);

  let result;
  result = await client.queryContractSmart(sg721, {
    num_tokens: {},
  });
  console.log('num_tokens :', result);

  let {tokens} = await client.queryContractSmart(sg721, {
    tokens: { owner: account },
  });
  console.log('tokens :', result);

  for (let i = 0; i < tokens.length; i++) {
    result = await client.queryContractSmart(sg721, {
      nft_info: { token_id: tokens[i] },
    });
    console.log(tokens[i], result);
  }
}
queryInfo();
