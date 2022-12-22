/*
 * This is the main config for your NFT sale.
 *
 * Fill this out with all your project details.
 */

module.exports = {
  //// ACCOUNT INFO ////
  // The account seed phrase to use for deployment
  mnemonic:
    '',
  // Your STARS address
  account: '',

  //// API CONFIG ////
  // The RPC endpoint for Stargaze, Elgafar Testnet
  rpcEndpoint: 'https://rpc.elgafar-1.stargaze-apis.com/',
  // The RPC endpoint for Stargaze, mainnet
  // rpcEndpoint: 'https://rpc.stargaze-apis.com/',
  // NFT.storage endpoint
  nftStorageEndpoint: 'https://api.nft.storage',
  // NFT.storage API key
  nftStorageApiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVBN2JDMDZEMzE0RUE2NDdlMGE3OTQ2OUE2YzUwZmFiODhENzdCNDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NDIwMzYyNTc4MiwibmFtZSI6IlNBTU5GVCJ9.otzi5G8BCGhtZKC3gKxkBujM9fA4iuHayc8Q4_3dHME',
  // Pinata API Key (optional)
  pinataApiKey: '10d510f11abd60be49a7',
  // Pinata Secret Key (optional)
  pinataSecretKey:
    '9990913d36fb68a2b840f7a2964eb210420e5968008338dacef633f2f2851a1b',

  //// COLLECTION INFO ////
  // The name of your collection
  name: 'AquaNauts',
  // The 3-7 letter ticker symbol for your collection
  symbol: 'AQUA',
  // Project description
  description:
    'NFTs packed with value and utility that make a real difference in the world',
  // Link to image to use as the main image for the collection.
  // Either IPFS or valid http links allowed. Gif compatible.
  // (at least 500 x 500 pixels)
  image:
    'https://bafybeigclyfgaysx73ch43hvqfdx6jt26saocpf4gggd3dyblh3pixtlda.ipfs.nftstorage.link/',
  // External_link is optional. Gif compatible
  //   external_link:
  // 'https://c.tenor.com/o656qFKDzeUAAAAC/rick-astley-never-gonna-give-you-up.gif',
  // The address for royalites to go to (may be the same as `account`)
  // Comment out both below if not using royalites
  royaltyPaymentAddress: 'stars1uyjwsywch5h6x9pwrakj46y6fcr3a9w66mkn90',
  // Royalty share: 1 = 100%, 0.1 = 10%
  royaltyShare: '0.1',

  //// WHITELIST CONTRACT (OPTIONAL) ////
  // A list of whitelisted addresses that will be able to purchase the sale early
  // Comment out if not using a whilelist
  whitelist: ['stars12v06zrrhw0vs83t83svsddgl4ndfmk9cny2wu3'],
  // The date when the whitelist only purchasing period ends and everyone can buy (in ISO format)
  whitelistStartTime: '2022-11-30T18:00:00.000Z',
  whitelistEndTime: '2022-11-31T06:00:00.000Z',
  // The price (in STARS) for the whitelist (minimum 25 STARS)
  whitelistPrice: 4300,
  // The Per Address Limit during whitelist period this can be different than the main public limit
  whitelistPerAddressLimit: 5,
  // The number of members in the whitelist (max 5000, each 1000 is 100 STARS)
  whitelistMemberLimit: 300,
  // The contract address for your whitelist contract
  // Get this after running `yarn whitelist`
  whitelistContract:
    'stars1854vdrkhhd8wuuss3j37skk90ue9a0rt9vqm9r6tp62uj69l77vsvwpwhq',

  //// MINTER CONTRACT ////
  // The base URI to be used to programatically mint tokens
  baseTokenUri:
    'ipfs://bafybeiaq3soaeiele2zx3n2qomksia352pooa5wbk5scnczzvucaqbad7m/galaxy4phyYu',
  // The number of tokens to mint
  numTokens: 100,
  // The price (in STARS) for your NFTs (minimum 50 STARS)
  mintPrice: 5400,
  // The max amount of NFTs an address can mint
  perAddressLimit: 10,
  // The date when the sale goes live
  // If whitelist is enabled, only whitelisted addresses will be able to purchase
  // startTime in ISO format
  startTime: '2022-12-23T06:00:00.000Z',
  // The minter contract address
  // Get this after running `yarn minter`
  minter: 'stars1ehywnyflusrmcpn4g4e9aq5cud3qe04yalqgc0kuwmp8j9lfhz5qw0e5zp',
  // SG721 contract address
  // Get this after running `yarn minter`
  sg721: 'stars1v8xx8mzweqvpuuvp9k5rmx90jupfnsd78wwj5ckpv4e4knv53v6sv5drfu',

  //// CONTRACT CODE IDs: Double Double Testnet ////
  // The code ID for sg721_base
  sg721BaseCodeId: 274,
  // The code ID for vending_minter
  serialPrintMinterCodeId: 728,
  // The code ID for vending_factory contract
  serialPrintFactoryCodeId: 727,
  // Addr for vending factory contract
  serialPrintFactory:
    'stars1hrfuuujh2wuv7gaevhxu8d299pdc398xh43vtxpkewlnk8z3x9kqlruc98',
  // The code ID for the whitelist contract
  whitelistCodeId: 277,
  // marketplace:
  //   'stars18cszlvm6pze0x9sz32qnjq4vtd45xehqs8dq7cwy8yhq35wfnn3qgzs5gu',

  // //// CONTRACT CODE IDs: Mainnet ////
  // // The code ID for sg721
  // sg721CodeId: 1,
  // // The code ID for the minter contract
  // minterCodeId: 2,
  // // The code ID for the whitelist contract
  // whitelistCodeId: 3,
  //   marketplace:
  //       'stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl',
};
