import { GITHUB_DETAILS, STORAGE_KEYS } from "@/app/common/constant";
import { compareSemver, getAppVersion } from "@/app/common/helpers";
import { Component, inject, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import {
  Application,
  ApplicationSettings,
  Color,
  Dialogs,
  Page,
  Utils,
} from "@nativescript/core";
import { openUrl } from "@nativescript/core/utils";
import { AllChannelScreen } from "../all-channel-screen/all-channel";
import { CategoryScreen } from "../category-screen/category";
import { FavoriteScreen } from "../favorite-screen/favorite";

@Component({
  selector: "main-screen",
  templateUrl: "main.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    NativeScriptCommonModule,
    CategoryScreen,
    AllChannelScreen,
    FavoriteScreen,
  ],
})
export class MainScreen {
  private page = inject(Page);

  constructor() {
    this.page.actionBarHidden = true;
    // this.page.androidStatusBarBackground = new Color("#08CB00");

    if (__ANDROID__) {

      // const window = Application.android.startActivity.getWindow();
      // window.setStatusBarColor(new Color("#08CB00").android);

      Utils.android
        .getCurrentActivity()
        ?.setRequestedOrientation(
          android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT,
        );
    }

    if (!__DEV__) this.checkForUpdate();
  }

  private checkForUpdate() {
    const now = new Date();
    const disablePopupForDate = ApplicationSettings.getString(
      STORAGE_KEYS.DisablePopupForVersionForTimestamp,
    );
    if (!disablePopupForDate || now > new Date(disablePopupForDate)) {
      fetch(
        `https://api.github.com/repos/${GITHUB_DETAILS.UserName}/${GITHUB_DETAILS.AppName}/releases/latest`,
      )
        .then((res) => (res.ok ? res.json() : new Error()))
        .then(({ tag_name, html_url }) => {
          const currentVersion = getAppVersion();
          if (compareSemver(tag_name, currentVersion) < 1) return;
          const currentDisableForVersion = ApplicationSettings.getString(
            STORAGE_KEYS.DisablePopupForVersion,
          );
          if (currentDisableForVersion === tag_name) return;

          Dialogs.action(`🚀 New version available\n ${tag_name}`, "Cancel", [
            "View & Download",
            "Ignore this version",
          ])
            .then((result) => {
              switch (result) {
                case "View & Download":
                  openUrl(html_url);
                  break;
                case "Ignore this version":
                  ApplicationSettings.setString(
                    STORAGE_KEYS.DisablePopupForVersion,
                    tag_name,
                  );
                  break;
                default:
                  // Disable this popup for next 24 hours
                  ApplicationSettings.setString(
                    STORAGE_KEYS.DisablePopupForVersionForTimestamp,
                    new Date(now.setDate(now.getDate() + 1)).toISOString(),
                  );
              }
            })
            .catch(() => { });
        })
        .catch(() => console.log("Unable to fetch update details"));
    }
  }
}
