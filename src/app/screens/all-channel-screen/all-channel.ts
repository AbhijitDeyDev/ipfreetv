import { ChannelList } from "@/app/components/channel-list/channel-list";
import { Header } from "@/app/components/header/header";
import { Component, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ImgDirective } from "@nativescript-community/ui-image/angular";
import { NativeScriptCommonModule } from "@nativescript/angular";
import IndianChannels from "../../../assets/json/IndianChannels.json";

@Component({
  selector: "all-channel-screen",
  templateUrl: "all-channel.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, ChannelList, ImgDirective, Header],
})
export class AllChannelScreen {
  channels = signal(IndianChannels);

  onSearchInputChange(searchInput: string) {
    const newChannels = searchInput.trim().length
      ? IndianChannels.filter((channel) =>
          channel.name.toLowerCase().includes(searchInput),
        )
      : IndianChannels;
    this.channels.set(newChannels);
  }
}
