import { EventData, fromObject, ObservableArray, Page } from '@nativescript/core';
import IndianChannels from "~/assets/json/IndianChannels.json";

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;

  const channelsModel = new ObservableArray(IndianChannels);

  const viewModel = fromObject({
    channels: channelsModel,
    onSearchInputChange,
  });

  function onSearchInputChange(searchInput: string) {
    const newChannels = searchInput.trim().length ?
      IndianChannels.filter(channel => channel.name.toLowerCase().includes(searchInput)) :
      IndianChannels;
    if (newChannels.length !== channelsModel.length) {
      channelsModel.splice(0, IndianChannels.length, ...newChannels);
      viewModel.notifyPropertyChange('channels', newChannels);
    }
  }

  page.bindingContext = viewModel;
}
