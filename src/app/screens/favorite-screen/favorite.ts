import { FavoriteChannel } from "@/app/common/services/favorite-channel";
import { ChannelList } from "@/app/components/channel-list/channel-list";
import { Header } from "@/app/components/header/header";
import {
  Component,
  effect,
  inject,
  NO_ERRORS_SCHEMA,
  signal,
} from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

@Component({
  selector: "favorite-screen",
  templateUrl: "favorite.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, Header, ChannelList],
})
export class FavoriteScreen {
  favoriteService = inject(FavoriteChannel);
  channels = signal(this.favoriteService.favoriteChannels());

  constructor() {
    effect(() => {
      this.channels.set(this.favoriteService.favoriteChannels());
    });
  }

  onSearchInputChange(searchInput: string) {
    const newChannels = searchInput.trim().length
      ? this.favoriteService
          .favoriteChannels()
          .filter((channel) => channel.name.toLowerCase().includes(searchInput))
      : this.favoriteService.favoriteChannels();
    this.channels.set(newChannels);
  }
}
