import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const neonEVMDevnetTokens = {
  weth: WETH9[ChainId.NEON_EVM_DEVNET],
  usdc: USDC[ChainId.NEON_EVM_DEVNET],
}
