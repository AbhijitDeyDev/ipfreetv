import { Page } from "@nativescript/core";
import { NavigationData } from "@nativescript/core/ui/frame";
import { getCurrentActivity } from "@nativescript/core/utils/android";

export function onNavigatingTo(eventData: NavigationData){
  (eventData.object as Page).actionBarHidden = true;

  if (__ANDROID__) {
    getCurrentActivity()
      .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
  }
}
