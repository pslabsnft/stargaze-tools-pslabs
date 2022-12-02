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
    '',
  // Pinata API Key (optional)
  pinataApiKey: '',
  // Pinata Secret Key (optional)
  pinataSecretKey:
    '',

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
  numTokens: 1000,
  // The price (in STARS) for your NFTs (minimum 50 STARS)
  mintPrice: 5400,
  // The max amount of NFTs an address can mint
  perAddressLimit: 10,
  // The date when the sale goes live
  // If whitelist is enabled, only whitelisted addresses will be able to purchase
  // startTime in ISO format
  startTime: '2022-12-03T06:00:00.000Z',
  // The minter contract address
  // Get this after running `yarn minter`
  minter: 'stars1lev4qkwml9347elh2g2vm509cvrj5h78x4ly7sfr9wy0674vx9vqf3kx85',
  // SG721 contract address
  // Get this after running `yarn minter`
  sg721: 'stars1rw9csxx0gdke9vs3vfrax3mwuc0ak2hjqkc3znpp4raxwjusrpksavkmvk',

  //// CONTRACT CODE IDs: Double Double Testnet ////
  // The code ID for sg721_base
  sg721BaseCodeId: 274,
  // The code ID for vending_minter
  vendingMinterCodeId: 603,
  // The code ID for vending_factory contract
  vendingFactoryCodeId: 602,
  // Addr for vending factory contract
  vendingFactory:
    'stars1yvfjyq07hn92dufqlzcu4yz92gdyww7zr8pr2kr3wfgrcc97nqpseyhyue',
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
