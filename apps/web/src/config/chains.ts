import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import {
  Chain,
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  base,
  baseGoerli,
  baseSepolia,
  bscTestnet,
  bsc as bsc_,
  goerli,
  linea,
  lineaTestnet,
  mainnet,
  opBNB,
  opBNBTestnet,
  polygonZkEvm,
  polygonZkEvmTestnet,
  scrollSepolia,
  sepolia,
  zkSync,
} from 'wagmi/chains'

export const neonEvm: Chain = {
  id: 245022934,
  name: 'Neon EVM',
  network: 'neonEvm',
  nodeUrls: {
    default: 'https://neon-proxy-mainnet.solana.p2p.org',
  },
  rpcUrls: {
    default: {
      http: ['https://neon-evm.drpc.org'],
      webSocket: ['wss://neon-evm.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Neon Explorer',
      url: 'https://neonscan.org/',
    },
    traceMove: {
      name: '',
      url: '',
    },
  },
  testnet: false,
  faucetUrl: 'https://neonfaucet.org/',
}

export const neonEvmDevnet: Chain = {
  id: 245022926,
  name: 'Neon EVM (devnet)',
  network: 'neonEvmDevnet',
  nodeUrls: {
    default: 'https://devnet.neonevm.org',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.neonevm.org'],
      webSocket: ['wss://devnet.neonevm.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Neon Devnet Explorer',
      url: 'https://devnet.neonscan.org/',
    },
    traceMove: {
      name: '',
      url: '',
    },
  },
  testnet: true,
  faucetUrl: 'https://neonfaucet.org/',
}

export const CHAIN_QUERY_NAME = chainNames

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

const bsc = {
  ...bsc_,
  rpcUrls: {
    ...bsc_.rpcUrls,
    public: {
      ...bsc_.rpcUrls,
      http: ['https://bsc-dataseed.binance.org/'],
    },
    default: {
      ...bsc_.rpcUrls.default,
      http: ['https://bsc-dataseed.binance.org/'],
    },
  },
} satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON_ZKEVM,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.OPBNB,
  ChainId.OPBNB_TESTNET,
  ChainId.ARBITRUM_SEPOLIA,
  ChainId.BASE_SEPOLIA,
]

export const CHAINS: [Chain, ...Chain[]] = [
  neonEvm,
  neonEvmDevnet,
  bsc,
  bscTestnet,
  mainnet,
  goerli,
  sepolia,
  /*
  polygonZkEvm,
  polygonZkEvmTestnet,
  zkSync,
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  linea,
  lineaTestnet,
  base,
  baseGoerli,
  baseSepolia,
  opBNB,
  opBNBTestnet,
  scrollSepolia,
  */
]
