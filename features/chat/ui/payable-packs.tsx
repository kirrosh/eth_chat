import {
  useBuyEmojiPack,
  useEmojiTokenBalance,
} from 'features/emoji-packs/useEmojiTokenBalance'
import { useAccount } from 'wagmi'

const silverPack = ['🥸', '🤓', '🧐', '🤨', '😝']

type Props = {
  addEmoji: (value: string) => void
}

export const Packs = ({ addEmoji }: Props) => {
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  })
  const address = accountData?.address
  const [{}, buyPack] = useBuyEmojiPack(0)
  const silver = useEmojiTokenBalance(address, 0)
  // const gold = useEmojiTokenBalance(address, 1)
  // const platinum = useEmojiTokenBalance(address, 2)
  // console.log(silver)
  return (
    <div className="flex gap-1 disabled:opacity-20">
      {silverPack.map((item) => (
        <button key={item} className="btn-ghost" onClick={() => addEmoji(item)}>
          {item}
        </button>
      ))}
      <button onClick={() => buyPack()} className="btn-ghost">
        BUY
      </button>
    </div>
  )
}
