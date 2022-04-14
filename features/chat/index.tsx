import {
  IChannelMessage,
  useChannel,
  useInitAbly,
} from "features/ably/useChannel"
import { atom, useAtom, useSetAtom } from "jotai"
import { BackspaceIcon, XCircleIcon } from "@heroicons/react/outline"
import { useEmojiTokenBalance } from "features/emoji-packs/useEmojiTokenBalance"
import { Packs } from "./ui/payable-packs"
import { useAccount } from "wagmi"

const messagesAtom = atom<IChannelMessage[]>([])

const addMessageAtom = atom<IChannelMessage[], IChannelMessage>(
  (get) => get(messagesAtom),
  (get, set, message: IChannelMessage) => {
    const messages = get(messagesAtom)
    const history = messages.slice(-199)
    set(messagesAtom, [...history, message])
  }
)

const emojiAtom = atom("😂😂😂")
const addEmojiAtom = atom(
  (get) => get(emojiAtom),
  (get, set, newEmoji) => {
    const current = get(emojiAtom)
    if (current.length < MAX_LENTH * 2) {
      set(emojiAtom, get(emojiAtom) + newEmoji)
    }
  }
)
const removeEmojiAtom = atom(
  (get) => get(emojiAtom),
  (get, set) => {
    set(emojiAtom, get(emojiAtom).slice(0, -2))
  }
)

const freeEmoji = ["😂", "😜", "😱", "🥲", "😎"]
const MAX_LENTH = 7

const formatEthAddress = (address: string) =>
  address.slice(0, 6) + "..." + address.slice(-4)

export const Chat = () => {
  const [receivedMessages, setMessages] = useAtom(addMessageAtom)
  const addEmoji = useSetAtom(addEmojiAtom)
  const removeEmoji = useSetAtom(removeEmojiAtom)
  const [emoji, setEmoji] = useAtom(emojiAtom)
  // const { activateBrowserWallet, account } = useEthers()
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  })

  // useInitAbly(account)
  const [channel, ably] = useChannel("chat-demo", setMessages)

  const sendMessage = async () => {
    await channel?.publish({
      name: "chat-message",
      data: {
        account: accountData?.address,
        message: emoji,
      },
    })
    setEmoji("")
  }
  channel?.presence.subscribe(console.log)
  channel?.presence.get().then(console.log)
  return (
    <div className="h-full flex flex-col gap-3">
      <ul className="flex-grow overflow-auto">
        {receivedMessages.map((item) => (
          <li key={item.id}>
            <div className="my-2 flex gap-1 text-lg">
              <div className="px-2 py-1 rounded bg-purple-600 text-white">
                {formatEthAddress(item.clientId)} :
              </div>
              <div className="py-1">{item.data.message}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-2xl flex justify-between">
        {emoji}
        <div className="text-purple-600">
          {MAX_LENTH - emoji.length / 2} left
        </div>
      </div>
      <div className="flex gap-2">
        {freeEmoji.map((item) => (
          <button
            key={item}
            className="btn-ghost"
            onClick={() => addEmoji(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <Packs addEmoji={addEmoji} />
      <div className="flex gap-2">
        <button className="btn-ghost flex-grow" onClick={() => removeEmoji()}>
          <BackspaceIcon className="h-6 w-6" />
        </button>
        <button className="btn-ghost flex-grow" onClick={() => setEmoji("")}>
          <XCircleIcon className="h-6 w-6" />
        </button>
        <button
          disabled={emoji.length === 0}
          className="btn-primary flex-grow"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}
