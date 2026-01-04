import { EventData, fromObject, Page, Utils } from '@nativescript/core';
import IndianChannels from "~/assets/json/IndianChannels.json";
import { getTopFrame } from '../../common/helpers';

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;

  const categories = getChannelCategories();

  if (__ANDROID__) {
    Utils.android
      .getCurrentActivity()
      .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
  }

  const viewModel = fromObject({
    items: categories,
    onItemTap: (category: string) => {
      return () => {
        getTopFrame(page).navigate({
          moduleName: 'screens/channel-by-category-page/channel-by-category-page',
          context: { category },
          animated: true
        });
      };
    },
    onSearchInputChange,
  });

  function onSearchInputChange(searchInput: string) {
    viewModel.set('items',
      searchInput.trim().length ?
        categories.filter(({ name }) => name.toLowerCase().includes(searchInput)) :
        categories
    );
  }

  page.bindingContext = viewModel;
}

function getChannelCategories() {
  const categories: Record<string, number> = {};
  IndianChannels.forEach(({ "group-title": groupTitle }) => {
    const groupTitles = groupTitle.trim().length ? groupTitle.split(';') : ['Others'];
    groupTitles.forEach(gTitle => {
      if (Object.hasOwn(categories, gTitle))
        categories[gTitle]++;
      else categories[gTitle] = 1;
    });
  });
  return Object.entries(categories).map(([key, value]) => ({
    name: key,
    count: value
  }));
}
