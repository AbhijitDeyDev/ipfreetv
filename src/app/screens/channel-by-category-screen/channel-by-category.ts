import { getChannelsByCategory } from "@/app/common/helpers";
import { ChannelList } from "@/app/components/channel-list/channel-list";
import { Header } from "@/app/components/header/header";
import { Component, inject, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { Page } from "@nativescript/core";

@Component({
  selector: "channel-by-category-screen",
  templateUrl: "channel-by-category.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, ChannelList, Header],
})
export class ChannelByCategoryScreen {
  private route = inject(ActivatedRoute);
  private page = inject(Page);

  category = this.route.snapshot.queryParams.category;
  channels = getChannelsByCategory(this.category);
  filteredChannels = signal(this.channels);

  constructor() {
    this.page.actionBarHidden = true;
  }

  onSearchInputChange(searchInput: string) {
    const newChannels = searchInput.trim().length
      ? this.channels.filter((channel) =>
          channel.name.toLowerCase().includes(searchInput),
        )
      : this.channels;
    this.filteredChannels.set(newChannels);
  }
}
