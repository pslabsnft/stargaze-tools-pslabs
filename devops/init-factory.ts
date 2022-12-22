const config = require('../config');
import { getClient } from '../src/client';

async function init() {
  const client = await getClient();
  try {
    const msg = {
      params: {
        code_id: config.serialPrintMinterCodeId,
        creation_fee: { denom: 'ustars', amount: '1000000000' },
        min_mint_price: { denom: 'ustars', amount: '50000000' },
        mint_fee_bps: 1000,
        max_trading_offset_secs: 1209600,
        extension: {
          dynamic_creation_fee_threshold: 10_000,
          creation_fee_per_token: "100000",
          max_per_address_limit: 50,
          airdrop_mint_price: { denom: 'ustars', amount: '0' },
          airdrop_mint_fee_bps: 0,
        },
      },
    };
    const result = await client.instantiate(
      config.account,
      config.serialPrintFactoryCodeId,
      msg,
      'factory init',
      'auto'
    );
    console.log(result)
  } catch (error) {
    console.error('Error:' + error);
    process.exit(1);
  }
}

init();
