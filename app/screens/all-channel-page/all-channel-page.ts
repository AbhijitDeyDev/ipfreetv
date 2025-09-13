import { ApplicationSettings, Dialogs, EventData, Frame, fromObject, Page } from '@nativescript/core';
import IndianChannels from "~/assets/json/IndianChannels.json";
import { STORAGE_KEYS } from '../../common/constant';

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;

  const searchInputModel = fromObject({ searchInput: '' });

  const viewModel = fromObject({
    items: IndianChannels,
    onItemEvent: (channel: typeof IndianChannels[0]) => {
      return ({ eventName }: EventData) => {
        onChannelItemTap(channel, eventName, page.frame.page.frame);
      };
    },
    onSearchInputChange,
  });

  function onSearchInputChange(searchInput: string) {
    viewModel.set('items',
      searchInput.trim().length ?
        IndianChannels.filter(channel => channel.name.toLowerCase().includes(searchInput)) :
        IndianChannels
    );
  }

  page.on("navigatingTo", () => {
    searchInputModel.off("searchInput");
    page.off("navigatingTo");
  });
  page.bindingContext = viewModel;
}

export function onChannelItemTap(
  channel: typeof IndianChannels[0],
  eventName: string,
  frame: Frame,
  refreshDataCallback?: () => void
) {
  const favoriteChannelKey = `${STORAGE_KEYS.FavoriteChannel}${channel.id}`;
  const isFavoriteChannel = ApplicationSettings.hasKey(favoriteChannelKey);
  switch (eventName) {
    case "tap":
      frame.navigate({
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
            ApplicationSettings.remove(favoriteChannelKey);
            refreshDataCallback?.();
            break;
          case "Add Channel to Favorites":
            ApplicationSettings.setBoolean(favoriteChannelKey, true);
            break;
          default:
        }
      }).catch(() => { });
      break;
    default:
  }
}
