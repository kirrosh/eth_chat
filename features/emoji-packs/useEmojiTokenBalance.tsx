import { utils, getDefaultProvider } from 'ethers'

import EmojiPacks from 'etherium/artifacts/contracts/EmojiPacks.sol/EmojiPacks.json'
import EmojiTrader from 'etherium/artifacts/contracts/EmojiTrader.sol/EmojiTrader.json'
import { emoji_address_ropsten } from 'etherium/address/emoji'
import { useEffect, useMemo, useState } from 'react'
import { useContractRead, useSigner } from 'wagmi'

const packsInterface = new utils.Interface(EmojiPacks.abi)
const traderInterface = new utils.Interface(EmojiTrader.abi)
const provider = getDefaultProvider('ropsten')

export const useBuyEmojiPack = (tokenId: number) => {
  const [{ data }] = useSigner()
  const args = useMemo(
    () => [
      emoji_address_ropsten.packs,
      tokenId,
      1,
      { value: utils.parseUnits('1000', 'wei') },
    ],
    [emoji_address_ropsten.packs, tokenId]
  )
  return useContractRead(
    {
      addressOrName: emoji_address_ropsten.trader,
      contractInterface: traderInterface,
      signerOrProvider: data,
    },
    'purchase',
    { args, skip: true }
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
  return balance
}
