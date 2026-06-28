import IndianChannels from "@/assets/json/IndianChannels.json";
import { Component, inject, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ImgDirective } from "@nativescript-community/ui-image/angular";
import {
  NativeScriptCommonModule,
  registerElement,
} from "@nativescript/angular";
import { Application, Page, Screen, Utils } from "@nativescript/core";
import { Menu } from "nativescript-menu";
import { Video } from "nativescript-videoplayer";

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
  private videoPlayer = signal<Video | null>(null);

  fullscreenTogglePosition = Screen.mainScreen.widthDIPs - 40;
  centeredPixels = {
    top: (Screen.mainScreen.heightDIPs / 2) - 25,
    left: (Screen.mainScreen.widthDIPs / 2) - 25,
  };

  sources = <(typeof IndianChannels)[0]["links"]> (
    JSON.parse(this.route.snapshot.queryParams.sources)
  );
  source = signal(this.sources[0]);
  isPlayerReady = signal(false);
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
    this.isPlayerReady.set(true);
    this.videoPlayer.set(eventData.object);
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
            // try {
            //   if (videoPlayer.getPlayer()) videoPlayer.destroy();
            // } catch (e) {
            //   console.error("Unable to detroy video player: ", e);
            // }
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
    this.videoPlayer()?.stop();

    if (__ANDROID__) {
      const currentActivity = Utils.android.getCurrentActivity();
      if (currentActivity) {
        const window = currentActivity.getWindow();
        const insetsController = window.getInsetsController();
        if (newFullscreenState) {
          if (insetsController) {
            // 1. Configure bars to stay hidden but allow a pull-down swipe overlay
            insetsController.setSystemBarsBehavior(
              android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            );

            // 2. Explicitly target and hide the Status Bar (and Navigation Bar if desired)
            const statusBarType = android.view.WindowInsets.Type.statusBars();
            const navBarType = android.view.WindowInsets.Type.navigationBars();

            // Combines both using bitwise OR to completely clear the screen for video playback
            insetsController.hide(statusBarType | navBarType);
          }

          // 3. Rotate to Landscape
          currentActivity.setRequestedOrientation(
            android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE,
          );
          // 4. Set video play mode to fill
          this.videoPlayer()?.setMode('PORTRAIT', true);
        } else {
          if (insetsController) {
            // 1. Reset behavior settings to system default
            insetsController.setSystemBarsBehavior(
              android.view.WindowInsetsController.BEHAVIOR_DEFAULT
            );

            // 2. Bring the bars back into view
            const statusBarType = android.view.WindowInsets.Type.statusBars();
            const navBarType = android.view.WindowInsets.Type.navigationBars();

            insetsController.show(statusBarType | navBarType);
          }

          // 3. Rotate back to Portrait
          currentActivity.setRequestedOrientation(
            android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT,
          );
          // 4. Set video play mode back to default
          this.videoPlayer()?.setMode('PORTRAIT', false);
        }
      }
    }

    setTimeout(() => {
      eventData.view.left =
        Screen.mainScreen.widthDIPs - (newFullscreenState ? 60 : 40);
    }, 200);
    this.videoPlayer()?.play();
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
