import { EventData, fromObject, ItemEventData, ListView, Page } from '@nativescript/core';
import { getCurrentActivity } from '@nativescript/core/utils/android';
import IndianChannels from "~/assets/json/IndianChannels.json";

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;

  if (__ANDROID__) {
    getCurrentActivity()
      .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
  }

  const searchInputModel = fromObject({ searchInput: '' });

  const viewModel = fromObject({
    items: IndianChannels,
    onItemTap({ object, index }: ItemEventData) {
      const listView = object as ListView;
      listView.page.frame.navigate({
        moduleName: 'screens/video-page/video-page',
        context: { source: listView.items[index].url }
      })
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
