import { ApplicationSettings, Observable, ObservableArray } from "@nativescript/core";
import IndianChannels from "~/assets/json/IndianChannels.json";
import { STORAGE_KEYS } from "../constant";

class FavoriteChannelStore extends Observable {
  favoriteChannels: ObservableArray<typeof IndianChannels[0]>;

  private loadFromSettings() {
    const favoriteChannelIds = ApplicationSettings
      .getAllKeys()
      .filter(key => key.startsWith(STORAGE_KEYS.FavoriteChannel))
      .map(key => Number(key.split(':')[1]));
    const favoriteChannelIdsSet = new Set(favoriteChannelIds);
    this.favoriteChannels = new ObservableArray(
      IndianChannels.filter(({ id }) => favoriteChannelIdsSet.has(id))
    );
  }

  constructor() {
    super()
    this.loadFromSettings();
  }

  addToFavorite(id: number) {
    const favoriteChannelKey = `${STORAGE_KEYS.FavoriteChannel}:${id}`;
    ApplicationSettings.setBoolean(favoriteChannelKey, true);
    this.favoriteChannels.push(
      IndianChannels.find(channel => channel.id === id)
    );
  }

  removeFromFavorite(id: number) {
    const favoriteChannelKey = `${STORAGE_KEYS.FavoriteChannel}:${id}`;
    ApplicationSettings.remove(favoriteChannelKey);
    this.favoriteChannels.splice(
      this.favoriteChannels.findIndex(channel => channel.id === id),
      1
    );
  }

  isFavoriteChannel(id: number) {
    const favoriteChannelKey = `${STORAGE_KEYS.FavoriteChannel}:${id}`;
    return ApplicationSettings.hasKey(favoriteChannelKey)
  }
}

const favoriteChannelStore = new FavoriteChannelStore();
export default favoriteChannelStore;
