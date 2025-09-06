import { ActionBar, CoreTypes, EventData } from "@nativescript/core";

interface PropsType extends ActionBar {
  hideBackBtn: string;
}

export function onLoaded(args: EventData){
  const actionBar = (args.object as PropsType);
  actionBar.bindingContext = {
    title: actionBar.title,
    goBack: () => actionBar.page.frame.goBack(),
    hideBackBtn: actionBar.hideBackBtn
  };
}
