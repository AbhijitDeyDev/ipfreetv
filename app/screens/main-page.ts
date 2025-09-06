import { ListView, Observable, Page, ShowModalOptions } from '@nativescript/core';
import { EventData, ItemEventData } from '../../references';
//@ts-ignore
import IndianChannels from "~/assets/json/IndianChannels.json";

const viewModel = new Observable();

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.bindingContext = viewModel;

  viewModel.set("items", IndianChannels);

  viewModel.set("onItemTap", ({ object, index }: ItemEventData) => {
    const listView = object as ListView;
    console.log(listView.items[index]);
    object.page.showModal(
      'components/video-ui/video-ui',
      {
        fullscreen: true,
        context: { source: listView.items[index].url }
      } as ShowModalOptions
    );
  });
}
