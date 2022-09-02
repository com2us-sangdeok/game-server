export enum categoryMintType {
  // 단일 민팅
  minting = 1,

  // 조합 민팅
  mixMintig = 2,
}

export enum nftStatus {
  // 1: Non-NFT
  nonNFT = 1,

  // 2: Locked NFT
  LockedNFT = 2,

  // 3: Unlocked NFT
  unLockedNFT = 3,
}

export enum ConvertType {
  // 게임재화 -> C2X
  GoodsToC2x = 1,

  // C2X -> 게임재화
  C2xToGoods = 2,

  // 게임재화 -> 게임토큰
  GoodsToToken = 3,

  // 게임토큰 -> 게임재화
  TokenToGoods = 4,
}
