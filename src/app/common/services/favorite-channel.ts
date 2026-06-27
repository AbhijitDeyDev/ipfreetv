import { Injectable, signal } from "@angular/core";
import { ApplicationSettings } from "@nativescript/core";
import IndianChannels from "../../../assets/json/IndianChannels.json";
import { STORAGE_KEYS } from "../constant";

@Injectable({
  providedIn: "root",
})
export class FavoriteChannel {
  favoriteChannels = signal<typeof IndianChannels>([]);

  private loadFromSettings() {
    const favoriteChannelIds = ApplicationSettings.getAllKeys()
      .filter((key) => key.startsWith(STORAGE_KEYS.FavoriteChannel))
      .map((key) => Number(key.split(":")[1]));
    const favoriteChannelIdsSet = new Set(favoriteChannelIds);
    this.favoriteChannels.set(
      IndianChannels.filter(({ id }) => favoriteChannelIdsSet.has(id)),
    );
  }

  constructor() {
    this.loadFromSettings();
  }

  addToFavorite(id: number) {
    const favoriteChannelKey = `${STORAGE_KEYS.FavoriteChannel}:${id}`;
    ApplicationSettings.setBoolean(favoriteChannelKey, true);
    const channel = IndianChannels.find((channel) => channel.id === id);
    if (channel)
      this.favoriteChannels.update((channels) => [...channels, channel]);
  }

  removeFromFavorite(id: number) {
    const favoriteChannelKey = `${STORAGE_KEYS.FavoriteChannel}:${id}`;
    ApplicationSettings.remove(favoriteChannelKey);
    this.favoriteChannels.update((channels) =>
      channels.filter((channel) => channel.id !== id),
    );
  }

  isFavoriteChannel(id: number) {
    const favoriteChannelKey = `${STORAGE_KEYS.FavoriteChannel}:${id}`;
    return ApplicationSettings.hasKey(favoriteChannelKey);
  }
}
