import { ApplicationSettings, EventData, fromObject, ItemEventData, ListView, Page } from "@nativescript/core";
import IndianChannels from "~/assets/json/IndianChannels.json";
import { STORAGE_KEYS } from "../../common/constant";

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;

  const channels = getFavoriteChannels();

  const searchInputModel = fromObject({ searchInput: '' });

  const viewModel = fromObject({
    items: channels,
    onItemTap({ object, index }: ItemEventData) {
      const listView = object as ListView;
      page.frame.page.frame.navigate({
        moduleName: 'screens/video-page/video-page',
        context: { source: listView.items[index].url }
      })
    },
    onSearchInputChange,
  });

  function onSearchInputChange(searchInput: string) {
    viewModel.set('items',
      searchInput.trim().length ?
        channels.filter(channel => channel.name.toLowerCase().includes(searchInput)) :
        channels
    );
  }

  page.on("navigatingTo", () => {
    searchInputModel.off("searchInput");
    page.off("navigatingTo");
  });
  page.bindingContext = viewModel;
}

function getFavoriteChannels() {
  const favoriteChannelIds = ApplicationSettings
    .getAllKeys()
    .filter(key => key.startsWith(STORAGE_KEYS.FavoriteChannel))
    .map(key => Number(key.split(':')[1]));
  const favoriteChannelIdsSet = new Set(favoriteChannelIds);
  return IndianChannels.filter(({ id }) => favoriteChannelIdsSet.has(id));
}
