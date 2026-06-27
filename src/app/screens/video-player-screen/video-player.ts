import IndianChannels from "@/assets/json/IndianChannels.json";
import { Component, inject, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ImgDirective } from "@nativescript-community/ui-image/angular";
import {
  NativeScriptCommonModule,
  registerElement,
} from "@nativescript/angular";
import { Application, Page, Screen, Utils } from "@nativescript/core";
import { Video } from "@nstudio/nativescript-exoplayer";
import { Menu } from "nativescript-menu";

registerElement("Video", () => Video);

@Component({
  selector: "video-player-screen",
  templateUrl: "video-player.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, ImgDirective],
})
export class VideoPlayerScreen {
  private route = inject(ActivatedRoute);
  private page = inject(Page);

  fullscreenTogglePosition = Screen.mainScreen.widthDIPs - 40;

  sources = <(typeof IndianChannels)[0]["links"]> (
    JSON.parse(this.route.snapshot.queryParams.sources)
  );
  source = signal(this.sources[0]);
  isFullscreenButtonVisible = signal(false);
  isFullscreen = signal(false);

  constructor() {
    this.page.actionBarHidden = true;

    if (__ANDROID__) {
      const currentActivity = Utils.android.getCurrentActivity();
      if (currentActivity) {
        currentActivity
          .getWindow()
          .addFlags(
            android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
          );

        currentActivity.setRequestedOrientation(
          android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT,
        );
      }
    }
  }

  onVideoPlayerReady(eventData: any) {
    this.isFullscreenButtonVisible.set(true);
    if (__ANDROID__) {
      const currentActivity = Utils.android.getCurrentActivity();
      if (currentActivity) {
        currentActivity
          .getWindow()
          .addFlags(
            android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
          );

        const videoPlayer = eventData.object;
        Application.android.once("activityBackPressed", () => {
          try {
            try {
              if (videoPlayer.getPlayer()) videoPlayer.destroy();
            } catch (e) {
              console.error("Unable to detroy video player: ", e);
            }
            if (!currentActivity) return;

            if (this.isFullscreen()) {
              currentActivity
                .getWindow()
                .getInsetsController()
                .show(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

              currentActivity.setRequestedOrientation(
                android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT,
              );
            }
            currentActivity
              .getWindow()
              .clearFlags(
                android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
              );
          } catch (e) {
            console.log("Error: ", e);
          }
        });
      }
    }
  }

  toggleFullscreen(eventData: any) {
    const newFullscreenState = !this.isFullscreen();
    this.isFullscreen.set(newFullscreenState);

    if (__ANDROID__) {
      const currentActivity = Utils.android.getCurrentActivity();
      if (currentActivity) {
        if (newFullscreenState) {
          currentActivity
            .getWindow()
            .getInsetsController()
            .hide(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

          currentActivity.setRequestedOrientation(
            android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE,
          );

        } else {
          currentActivity
            .getWindow()
            .getInsetsController()
            .show(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

          currentActivity.setRequestedOrientation(
            android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT,
          );
        }
      }
    }

    setTimeout(() => {
      eventData.view.left =
        Screen.mainScreen.widthDIPs - (newFullscreenState ? 60 : 40);
    }, 200);
  }

  changeResolution(eventData: any) {
    const context = this;
    Menu.popup({
      view: eventData.object,
      actions: this.sources.map(({ url, resolution }, id) => ({
        id,
        title: `${resolution}${context.source().url === url ? " ✓" : ""}`,
      })),
    })
      .then((action) => {
        if (action) this.source.set(this.sources[action.id]);
      })
      .catch(console.log);
  }
}
