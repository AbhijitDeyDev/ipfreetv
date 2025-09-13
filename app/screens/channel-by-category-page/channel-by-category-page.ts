import { fromObject, ItemEventData, ListView, NavigatedData, Page } from '@nativescript/core';
import IndianChannels from "~/assets/json/IndianChannels.json";

export function navigatingTo(args: NavigatedData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;
  const category = args.context.category;
  const channels = getChannelsByCategory(category);

  const searchInputModel = fromObject({ searchInput: '' });

  const viewModel = fromObject({
    category,
    items: channels,
    onItemTap({ object, index }: ItemEventData) {
      const listView = object as ListView;
      page.frame.navigate({
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

function getChannelsByCategory(category: string) {
  return IndianChannels.filter(channel => channel['group-title'].includes(category));
}
