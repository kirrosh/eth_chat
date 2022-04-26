import { utils, getDefaultProvider } from 'ethers'

import EmojiPacks from 'artifacts/EmojiPacks.json'
import EmojiTrader from 'artifacts/EmojiTrader.json'
import { emoji_address_ropsten } from 'ethereum/address/emoji'
import { useEffect, useMemo, useState } from 'react'
import { useContractRead, useContractWrite, useSigner } from 'wagmi'

const packsInterface = new utils.Interface(EmojiPacks.abi)
const traderInterface = new utils.Interface(EmojiTrader.abi)
const provider = getDefaultProvider('ropsten')

const prices = {
  0: '1000',
  1: '10000',
  2: '100000',
}

export const useBuyEmojiPack = (tokenId: 0 | 1 | 2) => {
  const [{ data }] = useSigner()
  const args = useMemo(
    () => [
      emoji_address_ropsten.packs,
      tokenId,
      1,
      { value: utils.parseUnits(prices[tokenId], 'wei') },
    ],
    [emoji_address_ropsten.packs, tokenId]
  )
  return useContractWrite(
    {
      addressOrName: emoji_address_ropsten.trader,
      contractInterface: traderInterface,
      signerOrProvider: data,
    },
    'purchase',
    { args }
  )
}

export const useEmojiTokenBalance = (
  address: string | null | undefined,
  tokenId: number
) => {
  const [balance, setBalance] = useState<string>()
  const args = useMemo(() => [address, tokenId], [address, tokenId])
  const [{}, read] = useContractRead(
    {
      addressOrName: emoji_address_ropsten.packs,
      contractInterface: packsInterface,
      signerOrProvider: provider,
    },
    'balanceOf',
    { args }
  )
  useEffect(() => {
    read().then((res) => {
      res.data && setBalance(utils.formatUnits(res.data, 'wei'))
    })
  }, [args])
  return Number(balance)
}
