import { useBuyEmojiPack } from 'features/shop/lib/useEmojiTokenBalance'

const silverPack = ['🥸', '🤓', '🧐', '🤨', '😝']
const goldPack = ['👺', '🤯', '💩', '😺', '💃']
const platinumPack = ['👀', '🍑', '🏴‍☠️', '🔞', '💯']

export const Packs = () => {
  const [{}, buySilverPack] = useBuyEmojiPack(0)
  const [{}, buyGoldPack] = useBuyEmojiPack(1)
  const [{}, buyPlatinumPack] = useBuyEmojiPack(2)
  // const silver = useEmojiTokenBalance(address, 0)
  // const gold = useEmojiTokenBalance(address, 1)
  // const platinum = useEmojiTokenBalance(address, 2)
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between disabled:opacity-20">
          {silverPack.map((item) => (
            <button key={item} className="btn-ghost bg-zinc-100">
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={() => buySilverPack()}
          className="btn-ghost bg-zinc-100"
        >
          Buy Silver pack
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between disabled:opacity-20">
          {goldPack.map((item) => (
            <button key={item} className="btn-ghost bg-amber-100">
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={() => buyGoldPack()}
          className="btn-ghost bg-amber-100"
        >
          Buy Gold pack
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between disabled:opacity-20">
          {platinumPack.map((item) => (
            <button key={item} className="btn-ghost bg-slate-100">
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={() => buyPlatinumPack()}
          className="btn-ghost bg-slate-100"
        >
          Buy Platinum pack
        </button>
      </div>
    </div>
  )
}
