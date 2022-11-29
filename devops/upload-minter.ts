const config = require('../config');
import { getClient } from '../src/client';

import { readFileSync } from 'fs';

async function upload(contractPath: string) {
  console.log("uploading wasm")
  const client = await getClient();
  const wasm = readFileSync(contractPath);
  try {
    const tx = await client.upload(config.account, wasm, 'auto');
    console.log(tx)
    return tx.codeId;
  } catch (error) {
    console.error('Error:' + error);
    process.exit(1);
  }
}

upload('./wasm/minter.wasm');
