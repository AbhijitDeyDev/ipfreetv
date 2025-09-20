import { Application, EventData, fromObject, SearchBar, StackLayout } from "@nativescript/core";
import { getTopFrame } from "../../common/helpers";

interface PropsType extends StackLayout {
  title?: string;
  hideBackBtn?: string;
  showSearch?: string;
  searchInputChange?: (text: string) => void;
}

export function onLoaded(args: EventData) {
  const stackLayout = (args.object as PropsType);
  const viewModel = fromObject({
    title: stackLayout.title,
    goBack: () => stackLayout.page.frame.goBack(),
    toggleSearchMode,
    goToAbout,
    hideBackBtn: stackLayout.hideBackBtn,
    showSearch: stackLayout.showSearch,
    searchMode: false,
  });

  const searchBar = <SearchBar> stackLayout.getViewById('search_input');
  searchBar.on('textChange', ({ object }) => {
    stackLayout.searchInputChange?.(object.get('text'));
  });

  searchBar.on('unloaded', () => {
    searchBar.off('textChange');
    searchBar.off('unloaded');
  });

  function toggleSearchMode() {
    stackLayout.searchInputChange?.('');
    searchBar.text = '';
    viewModel.set('searchMode', !viewModel.get('searchMode'));
  }

  function goToAbout() {
    getTopFrame(stackLayout.page).navigate({
      moduleName: 'screens/about-page/about-page',
      animated: true
    });
  }

  if (__ANDROID__)
    Application.android.on('activityBackPressed', () => {
      stackLayout.searchInputChange?.('');
      searchBar.text = '';
      Application.android.off('activityBackPressed');
    });

  stackLayout.bindingContext = viewModel;
}
