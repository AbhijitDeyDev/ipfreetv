import { Component, inject, input, NO_ERRORS_SCHEMA } from "@angular/core";
import { CollectionViewComponent } from "@nativescript-community/ui-collectionview/angular";
import { ImgDirective } from "@nativescript-community/ui-image/angular";
import { MaterialRippleDirective } from "@nativescript-community/ui-material-ripple/angular";
import {
  NativeScriptCommonModule,
  RouterExtensions,
} from "@nativescript/angular";
import { Dialogs } from "@nativescript/core";
import { FavoriteChannel } from "~/app/common/services/favorite-channel";
import IndianChannels from "../../../assets/json/IndianChannels.json";

@Component({
  selector: "channel-list",
  templateUrl: "channel-list.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    NativeScriptCommonModule,
    CollectionViewComponent,
    ImgDirective,
    MaterialRippleDirective,
  ],
})
export class ChannelList {
  private router = inject(RouterExtensions);

  favoriteService = inject(FavoriteChannel);
  channels = input<typeof IndianChannels>([]);

  onItemTap(item: (typeof IndianChannels)[0]) {
    this.router.navigate(["video_player"], {
      queryParams: { sources: JSON.stringify(item.links) },
      transition: { name: 'slide' },
    });
  }

  onItemLongPress(item: (typeof IndianChannels)[0]) {
    const isFavoriteChannel = this.favoriteService.isFavoriteChannel(item.id);
    const REMOVE_CHANNEL = `Remove "${item.name}" from Favorites`;
    const ADD_CHANNEL = `Add "${item.name}" to Favorites`;
    Dialogs.action("Choose", "Cancel", [
      isFavoriteChannel ? REMOVE_CHANNEL : ADD_CHANNEL,
    ])
      .then((option) => {
        switch (option) {
          case REMOVE_CHANNEL:
            this.favoriteService.removeFromFavorite(item.id);
            break;
          case ADD_CHANNEL:
            this.favoriteService.addToFavorite(item.id);
            break;
          default:
        }
      })
      .catch(() => { });
  }
}
