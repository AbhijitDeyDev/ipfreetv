import { ApplicationSettings, Color, Dialogs, Page, Utils } from "@nativescript/core";
import { NavigationData } from "@nativescript/core/ui/frame";
import { GITHUB_DETAILS, STORAGE_KEYS } from "../common/constant";
import { compareSemver, getAppVersion } from "../common/helpers";
import { openUrl } from "@nativescript/core/utils";

export function onNavigatingTo(eventData: NavigationData) {
  const page = eventData.object as Page;
  page.actionBarHidden = true;
  page.androidStatusBarBackground = new Color("#08CB00");

  if (__ANDROID__) {
    Utils.android
      .getCurrentActivity()
      .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
  }

  // Checking if update available
  const now = new Date();
  const disablePopupForDate = ApplicationSettings.getString(STORAGE_KEYS.DisablePopupForVersionForTimestamp);
  if (!disablePopupForDate || now > new Date(disablePopupForDate)) {
    fetch(`https://api.github.com/repos/${GITHUB_DETAILS.UserName}/${GITHUB_DETAILS.AppName}/releases/latest`)
      .then(res => res.ok ? res.json() : new Error())
      .then(({ tag_name, html_url }) => {
        const currentVersion = getAppVersion();
        if (compareSemver(tag_name, currentVersion) < 1) return;
        const currentDisableForVersion = ApplicationSettings.getString(STORAGE_KEYS.DisablePopupForVersion);
        if (currentDisableForVersion === tag_name) return;

        Dialogs.action(
          `🚀 New version available\n ${tag_name}`,
          'Cancel',
          ['View & Download', 'Ignore this version']
        )
          .then((result) => {
            switch (result) {
              case 'View & Download':
                openUrl(html_url);
                break;
              case 'Ignore this version':
                ApplicationSettings.setString(STORAGE_KEYS.DisablePopupForVersion, tag_name);
                break;
              default:
                // Disable this popup for next 24 hours
                ApplicationSettings.setString(STORAGE_KEYS.DisablePopupForVersionForTimestamp, new Date(now.setDate(now.getDate() + 1)).toISOString());
            }
          })
          .catch(() => { });
      })
      .catch(() => console.log('Unable to fetch update details'));
  }
}
