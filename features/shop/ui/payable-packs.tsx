import { useBuyEmojiPack } from 'features/shop/lib/useEmojiTokenBalance'

export const silverPack = ['🥸', '🤓', '🧐', '🤨', '😝']
export const goldPack = ['👺', '🤯', '💩', '😺', '💃']
export const platinumPack = ['👀', '🍑', '🏴‍☠️', '🔞', '💯']

export const Packs = () => {
  const [{}, buySilverPack] = useBuyEmojiPack(0)
  const [{}, buyGoldPack] = useBuyEmojiPack(1)
  const [{}, buyPlatinumPack] = useBuyEmojiPack(2)

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
          Buy Silver pack (1000 wei)
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
          Buy Gold pack (10000 wei)
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
          Buy Platinum pack (100000 wei)
        </button>
      </div>
      <a
        href="https://ropsten.oregonctf.org/"
        target={'_blank'}
        className="underline text-primary"
      >
        Get ETH (Ropsten testnet!)
      </a>
    </div>
  )
}
