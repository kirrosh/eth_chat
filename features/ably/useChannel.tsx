import Ably from "ably/promises";
import { useEffect } from "react";

const ably = new Ably.Realtime.Promise({ authUrl: "/api/createTokenRequest" });

export type IChannelMessage = Ably.Types.Message;

export function useChannel(
  channelName: string,
  callbackOnMessage: (msg: IChannelMessage) => void
) {
  const channel = ably.channels.get(channelName);

  const onMount = () => {
    channel.subscribe((msg) => {
      callbackOnMessage(msg);
    });
  };

  const onUnmount = () => {
    channel.unsubscribe();
  };

  const useEffectHook = () => {
    onMount();
    return () => {
      onUnmount();
    };
  };

  useEffect(useEffectHook);

  return [channel, ably] as [typeof channel, typeof ably];
}
