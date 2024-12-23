import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { USDC } from './common'

export const neonEVMTokens = {
  weth: WETH9[ChainId.NEON_EVM],
  usdc: USDC[ChainId.NEON_EVM],
}
