/* eslint-disable @typescript-eslint/no-unused-vars */
import { Percent, Price } from '@pancakeswap/sdk'
import {
  PancakeSwapUniversalRouter,
  Permit2Signature,
  getUniversalRouterAddress,
} from '@pancakeswap/universal-router-sdk'
import { Router, Trade, Pair, pancakeRouterV2ABI } from '@pancakeswap/v2-sdk'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { useMemo } from 'react'

import { useGetENSAddressByName } from 'hooks/useGetENSAddressByName'

import { ClassicOrder } from '@pancakeswap/price-api-sdk'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { safeGetAddress } from 'utils'
import { Address, Hex, encodeFunctionData } from 'viem'

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param deadline the deadline for executing the trade
 * @param feeOptions the fee options to be applied to the trade.
 */
export function useSwapCallArguments(
  trade: ClassicOrder['trade'] | undefined | null,
  allowedSlippage: Percent,
  recipientAddressOrName: string | null | undefined,
  permitSignature: Permit2Signature | undefined,
  deadline: bigint | undefined,
  feeOptions: FeeOptions | undefined,
): SwapCall[] {
  const { account, chainId } = useAccountActiveChain()
  const recipientENSAddress = useGetENSAddressByName(recipientAddressOrName ?? undefined)
  const recipient = (
    recipientAddressOrName === null || recipientAddressOrName === undefined
      ? account
      : safeGetAddress(recipientAddressOrName)
      ? recipientAddressOrName
      : safeGetAddress(recipientENSAddress)
      ? recipientENSAddress
      : null
  ) as Address | null

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId) return []
    /*
    const methodParameters = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, {
      fee: feeOptions,
      recipient,
      inputTokenPermit: permitSignature,
      slippageTolerance: allowedSlippage,
      deadlineOrPreviousBlockhash: deadline?.toString(),
    })
    */
    // Format v2 swap call data from v4 trade
    const v2Route: any = trade.routes[0]
    v2Route.input = v2Route.inputAmount.currency
    v2Route.output = v2Route.outputAmount.currency
    v2Route.pairs = [new Pair(v2Route.inputAmount, v2Route.outputAmount)]
    const midPrice = v2Route.pools[0].reserve0.divide(v2Route.pools[0].reserve1)
    v2Route.midPrice = new Price(v2Route.input, v2Route.output, midPrice.denominator, midPrice.numerator)

    const v2Trade = new Trade(v2Route, trade.inputAmount, 0)

    console.log(v2Trade, 'v2Trade')

    const v2methodParameters = Router.swapCallParameters(v2Trade, {
      ttl: 10000,
      recipient,
      allowedSlippage,
    })

    const calldata = encodeFunctionData({
      abi: pancakeRouterV2ABI,
      args: v2methodParameters.args,
      functionName: 'swapExactTokensForTokens',
    })

    console.log(calldata, 'calldata')

    const swapRouterAddress = getUniversalRouterAddress(chainId)
    if (!swapRouterAddress) return []
    return [
      {
        address: swapRouterAddress,
        // calldata: methodParameters.calldata as `0x${string}`,
        calldata: calldata as `0x${string}`,
        // value: methodParameters.value as `0x${string}`,
        value: v2methodParameters.value as `0x${string}`,
      },
    ]
  }, [account, allowedSlippage, chainId, deadline, feeOptions, recipient, permitSignature, trade])
}
