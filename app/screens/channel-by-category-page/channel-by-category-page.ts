import { fromObject, ItemEventData, ListView, NavigatedData, ObservableArray, Page } from '@nativescript/core';
import IndianChannels from "~/assets/json/IndianChannels.json";

export function navigatingTo(args: NavigatedData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;

  const category = args.context.category;
  const channels = getChannelsByCategory(category);
  const channelsModel = new ObservableArray(channels);

  const viewModel = fromObject({
    category,
    channels: channelsModel,
    onSearchInputChange,
  });

  function onSearchInputChange(searchInput: string) {
    const newChannels = searchInput.trim().length ?
      channels.filter(channel => channel.name.toLowerCase().includes(searchInput)) :
      channels;
    if (newChannels.length !== channelsModel.length) {
      channelsModel.splice(0, channels.length, ...newChannels);
      viewModel.notifyPropertyChange('channels', newChannels);
    }
  }

  page.bindingContext = viewModel;
}

function getChannelsByCategory(category: string) {
  return IndianChannels.filter(channel =>
    (category === 'Others' && !channel['group-title'].trim().length) ||
    channel['group-title'].includes(category)
  );
}
