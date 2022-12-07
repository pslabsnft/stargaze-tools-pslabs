import {
  CreateMinterMsgForVendingMinterInitMsgExtension,
  Timestamp,
} from '@stargazezone/ts/src/VendingMinter.types';
import { coins, Decimal } from 'cosmwasm';
import inquirer from 'inquirer';
import { getClient } from '../src/client';
import { isValidHttpUrl, toStars } from '../src/utils';

const config = require('../config');

const NEW_COLLECTION_FEE = coins('1000000000', 'ustars');

function isValidIpfsUrl(uri: string) {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === 'ipfs:';
}

function clean(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function formatRoyaltyInfo(
  royaltyPaymentAddress: null | string,
  royaltyShare: string
) {
  if (royaltyPaymentAddress === null) {
    return null;
  } else {
    if (royaltyShare === undefined || royaltyShare == '') {
      throw new Error('royaltyPaymentAddress present, but no royaltyShare');
    }
    return { payment_address: royaltyPaymentAddress, share: royaltyShare };
  }
}

export async function create_minter() {
  console.log('Collection name:', config.name);
  console.log('Account:', config.account, '\n');
  const account = toStars(config.account);
  const whitelistContract = config.whitelistContract
    ? toStars(config.whitelistContract)
    : null;
  const royaltyPaymentAddress = config.royaltyPaymentAddress
    ? toStars(config.royaltyPaymentAddress)
    : null;
  const royaltyInfo = formatRoyaltyInfo(
    royaltyPaymentAddress,
    config.royaltyShare
  );

  if (!isValidIpfsUrl(config.baseTokenUri)) {
    throw new Error('Invalid base token URI');
  }

  if (!isValidIpfsUrl(config.image) && !isValidHttpUrl(config.image)) {
    throw new Error('Image link is not valid. Must be IPFS or http(s)');
  }

  if (config.numTokens > 10_000) {
    throw new Error('Too many tokens');
  }

  if (!config.perAddressLimit || config.perAddressLimit === 0) {
    throw new Error('perAddressLimit must be defined and greater than 0');
  }

  if (
    royaltyInfo &&
    Decimal.fromUserInput(royaltyInfo?.share, 3).isGreaterThan(
      Decimal.fromUserInput('0.100', 3)
    )
  ) {
    throw new Error("Royalty share must be lower than or equal to '0.100'");
  }

  const client = await getClient();

  // time expressed in nanoseconds (1 millionth of a millisecond)
  const startTime: Timestamp = (
    new Date(config.startTime).getTime() * 1_000_000
  ).toString();

  // time expressed in nanoseconds (1 millionth of a millisecond)
  const startTradingTime: Timestamp | null = config.startTradingTime
    ? (new Date(config.startTradingTime).getTime() * 1_000_000).toString()
    : null;

  // query whitelist contract to make sure it's valid.
  try {
    if (whitelistContract) {
      await client.queryContractSmart(whitelistContract, {
        config: {},
      });
    }
  } catch {
    throw new Error(
      'Error querying whitelist contract. Please double check whitelist address is valid.'
    );
  }

  const initMsg: CreateMinterMsgForVendingMinterInitMsgExtension = {
    init_msg: {
      base_token_uri: config.baseTokenUri,
      start_time: startTime,
      num_tokens: config.numTokens,
      mint_price: {
        amount: (config.mintPrice * 1000000).toString(),
        denom: 'ustars',
      },
      per_address_limit: config.perAddressLimit,
      whitelist: whitelistContract,
    },
    collection_params: {
      code_id: config.sg721BaseCodeId,
      name: config.name,
      symbol: config.symbol,
      info: {
        creator: config.account,
        description: config.description,
        image: config.image,
        explicit_content: config.explicit_content || false,
        royalty_info: royaltyInfo,
        start_trading_time: startTradingTime || null,
      },
    },
  };

  // should be stars1nelx34qg6xtm5u748jzjsahthddsktrrg5dw2rx8vzpc8hwwgk5q32mj2h
  console.log('vending factory addr: ', config.pslabFactory);

  const paramsResponse = await client.queryContractSmart(
    config.pslabFactory,
    {
      params: {},
    }
  );
  console.log('params response', paramsResponse);

  const tempMsg = { create_minter: initMsg };

  // TODO use recursive cleanup of undefined and null values
  if (
    tempMsg.create_minter?.collection_params.info?.royalty_info
      ?.payment_address === undefined &&
    tempMsg.create_minter?.collection_params.info?.royalty_info?.share ===
      undefined
  ) {
    tempMsg.create_minter.collection_params.info.royalty_info = null;
  }
  const msg = clean(tempMsg);

  // Get confirmation before preceding
  console.log(
    'Please confirm the settings for your minter and collection. THERE IS NO WAY TO UPDATE THIS ONCE IT IS ON CHAIN.'
  );
  console.log(JSON.stringify(msg, null, 2));
  console.log(
    'Cost of minter instantiation: ' +
      NEW_COLLECTION_FEE[0].amount +
      ' ' +
      NEW_COLLECTION_FEE[0].denom
  );
  const answer = await inquirer.prompt([
    {
      message: 'Ready to submit the transaction?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(
    account,
    config.pslabFactory,
    msg,
    'auto',
    config.name,
    NEW_COLLECTION_FEE
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
  if (wasmEvent != undefined) {
    console.info('Add these contract addresses to config.js:');
    console.info('factory address: ', wasmEvent.attributes[0]['value']);
    console.info('minter address: ', wasmEvent.attributes[2]['value']);
    console.info('sg721 contract address: ', wasmEvent.attributes[7]['value']);
    return wasmEvent.attributes[2]['value'];
  }
}

async function setWhitelist(whitelist: string) {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);
  const whitelistContract = toStars(whitelist);

  if (!minter) {
    throw Error(
      '"minter" must be set to a minter contract address in config.js'
    );
  }

  // query whitelist contract to make sure it's valid.
  try {
    const configResponse = await client.queryContractSmart(whitelistContract, {
      config: {},
    });
    console.log(configResponse);
  } catch {
    throw new Error(
      'Error querying whitelist contract. Please double check whitelist address is valid.'
    );
  }

  console.log('Minter contract: ', config.minter);
  console.log('Setting whitelist contract: ', whitelistContract);
  const msg = { set_whitelist: { whitelist: whitelistContract } };
  console.log(JSON.stringify(msg, null, 2));
  const answer = await inquirer.prompt([
    {
      message: 'Ready to submit the transaction?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(
    account,
    minter,
    msg,
    'auto',
    'set whitelist'
  );
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

async function updatePerAddressLimit() {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);
  const limit: number = config.perAddressLimit;

  if (!minter) {
    throw Error(
      '"minter" must be set to a minter contract address in config.js'
    );
  }
  console.log('Minter contract: ', config.minter);

  if (limit <= 0 || limit > 50) {
    throw new Error('invalid perAddressLimit in config.js');
  }

  const msg = { update_per_address_limit: { per_address_limit: limit } };
  console.log(JSON.stringify(msg, null, 2));
  const answer = await inquirer.prompt([
    {
      message: 'Ready to update per address limit to ' + limit + '?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(account, minter, msg, 'auto');
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

// Takes config.minter address and config.startTime
// and tries to update existing minter start time.
// Can not change if public mint already started.
async function updateStartTime() {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);

  // time expressed in nanoseconds (1 millionth of a millisecond)
  const publicStartTime: Timestamp = (
    new Date(config.startTime).getTime() * 1_000_000
  ).toString();
  const msg = { update_start_time: publicStartTime };
  console.log(JSON.stringify(msg, null, 2));
  const answer = await inquirer.prompt([
    {
      message:
        'Are you sure your want to change public mint start time to ' +
        config.startTime +
        ' ?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(account, minter, msg, 'auto');

  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

// Takes config.minter address and config.startTradingTime
// and tries to update existing start trading time.
// Can not update if it's beyond the max offset
async function updateStartTradingTime() {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);

  // time expressed in nanoseconds (1 millionth of a millisecond)
  const startTradingTime: Timestamp = (
    new Date(config.startTradingTime).getTime() * 1_000_000
  ).toString();
  const msg = { update_start_trading_time: startTradingTime };
  console.log(JSON.stringify(msg, null, 2));
  const answer = await inquirer.prompt([
    {
      message:
        'Are you sure your want to change start trading time to ' +
        config.startTradingTime +
        ' ?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(account, minter, msg, 'auto');

  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

// takes mint price from config and tries to update the price
async function updateMintPrice() {
  const client = await getClient();
  const account = toStars(config.account);
  const minter = toStars(config.minter);
  const price = (config.mintPrice * 1000000).toString();

  if (!minter) {
    throw Error(
      '"minter" must be set to a minter contract address in config.js'
    );
  }
  console.log('Minter contract: ', config.minter);

  const msg = { update_mint_price: { price } };
  console.log(JSON.stringify(msg, null, 2));
  const answer = await inquirer.prompt([
    {
      message:
        'Ready to update mint price to ' +
        price +
        'uStars (' +
        config.mintPrice +
        'stars)?',
      name: 'confirmation',
      type: 'confirm',
    },
  ]);
  if (!answer.confirmation) return;

  const result = await client.execute(account, minter, msg, 'auto');
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  console.info(
    'The `wasm` event emitted by the contract execution:',
    wasmEvent
  );
}

const args = process.argv.slice(2);
if (args.length == 0) {
  create_minter();
} else if (args.length == 2 && args[0] == '--whitelist') {
  setWhitelist(args[1]);
} else if (args.length == 1 && args[0] == '--update-start-time') {
  updateStartTime();
} else if (args.length == 1 && args[0] == '--update-start-trading-time') {
  updateStartTradingTime();
} else if (args.length == 2 && args[0] == '--per-address-limit') {
  updatePerAddressLimit();
} else if (args.length == 2 && args[0] == '--update-mint-price') {
  updateMintPrice();
} else {
  console.log('Invalid arguments');
}
