import { Dialogs, EventData, fromObject, ListView, ObservableArray, Page } from "@nativescript/core";
import IndianChannels from "~/assets/json/IndianChannels.json";
import { getTopFrame } from "../../common/helpers";
import favoriteChannelStore from "../../common/store/favorite-channels";

interface PropsType extends ListView {
  channels: ObservableArray<typeof IndianChannels[0]>;
}

export function onLoaded(args: EventData) {
  const listView = (args.object as PropsType);
  listView.bindingContext = fromObject({
    channels: listView.channels,
    onItemEvent: (channel: typeof IndianChannels[0]) => {
      return ({ eventName }: EventData) => {
        onChannelItemTap(channel, eventName, listView.page);
      };
    }
  });
}

function onChannelItemTap(
  channel: typeof IndianChannels[0],
  eventName: string,
  page: Page
) {
  const isFavoriteChannel = favoriteChannelStore.isFavoriteChannel(channel.id);
  switch (eventName) {
    case "tap":
      getTopFrame(page).navigate({
        moduleName: 'screens/video-page/video-page',
        context: { source: channel.url }
      });
      break;
    case "longPress":
      Dialogs.action(
        "Choose",
        "Cancel",
        [
          isFavoriteChannel ? "Remove Channel from Favorites" : "Add Channel to Favorites"
        ]
      ).then(option => {
        switch (option) {
          case "Remove Channel from Favorites":
            favoriteChannelStore.removeFromFavorite(channel.id);
            break;
          case "Add Channel to Favorites":
            favoriteChannelStore.addToFavorite(channel.id);
            break;
          default:
        }
      }).catch(() => { });
      break;
    default:
  }
}
