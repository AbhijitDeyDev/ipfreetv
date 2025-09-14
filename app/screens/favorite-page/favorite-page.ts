import { EventData, fromObject, ObservableArray, Page } from "@nativescript/core";
import favoriteChannelStore from "../../common/store/favorite-channels";

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;

  const channels = favoriteChannelStore.favoriteChannels;
  const channelsModel = new ObservableArray(...channels);
  let currentSearchInput = "";

  const viewModel = fromObject({
    channels: channelsModel,
    onSearchInputChange,
  });

  function onSearchInputChange(searchInput: string) {
    currentSearchInput = searchInput;
    const newChannels = searchInput.trim().length ?
      channels.filter(channel => channel.name.toLowerCase().includes(searchInput)) :
      channels;
    if (newChannels.length !== channelsModel.length) {
      channelsModel.splice(0, channels.length, ...newChannels);
      viewModel.notifyPropertyChange('channels', newChannels);
    }
  }

  channels.on('change', () => {
    channelsModel.splice(0, channelsModel.length, ...channels);
    viewModel.notifyPropertyChange('channels', channelsModel);
    if (currentSearchInput)
      onSearchInputChange(currentSearchInput);
  });
  page.on("navigatingTo", () => {
    channels.off('change');
    page.off("navigatingTo");
  });
  page.bindingContext = viewModel;
}
