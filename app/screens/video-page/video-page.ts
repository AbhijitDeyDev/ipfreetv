import { Application, fromObject, NavigatedData, Page, Screen, TapGestureEventData, Utils } from "@nativescript/core";
import { Video } from "@nstudio/nativescript-exoplayer";
import IndianChannels from "../../assets/json/IndianChannels.json";
import { Menu } from "nativescript-menu";

export function onNavigatingTo(args: NavigatedData) {
  const context = args.context as { sources: typeof IndianChannels[0]["links"]; };
  const page = args.object as Page;
  const videoPlayer = <Video> page.getViewById("video_player");
  page.actionBarHidden = true;

  const viewModel = fromObject({
    source: context.sources[0],
    isFullscreen: false,
    toggleFullscreen,
    changeResolution,
    fullscreenTogglePosition: Screen.mainScreen.widthDIPs - 30
  });

  if (__ANDROID__) {
    const currentActivity = Utils.android.getCurrentActivity();
    if (currentActivity) {

      currentActivity
        .getWindow()
        .addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

      currentActivity
        .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

      Application.android.once("activityBackPressed", () => {
        try {
          try {
            if (videoPlayer?.getPlayer())
              videoPlayer?.destroy();
          } catch (e) {
            console.error("Unable to detroy video player: ", e);
          }
          if (!currentActivity) return;

          if (viewModel.get('isFullscreen')) {
            currentActivity
              .getWindow()
              .getInsetsController()
              .show(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

            currentActivity
              .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
          }

          currentActivity
            .getWindow()
            .clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        } catch (e) {
          console.log("Error: ", e);
        }
      });
    }
  }

  function toggleFullscreen(eventData: TapGestureEventData) {
    const newFullscreenState = !viewModel.get('isFullscreen');
    viewModel.set('isFullscreen', newFullscreenState);

    if (__ANDROID__) {
      const currentActivity = Utils.android.getCurrentActivity();
      if (currentActivity) {
        if (newFullscreenState) {
          currentActivity
            .getWindow()
            .getInsetsController()
            .hide(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

          currentActivity
            .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        } else {
          currentActivity
            .getWindow()
            .getInsetsController()
            .show(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

          currentActivity
            .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }
      }
    }

    // Solves source is undefined on fullscreen issue.
    viewModel.setProperty("source", context.sources[0]);

    setTimeout(() => {
      eventData.view.left = Screen.mainScreen.widthDIPs - (newFullscreenState ? 100 : 30);
    }, 200);
  }

  function changeResolution() {
    Menu.popup({
      view: page.getViewById("menuBtn"),
      actions: context.sources.map(
        ({ url, resolution }, id) => ({
          id, title: `${resolution}${viewModel.get("source")?.url === url ? ' ✓' : ''}`
        })
      ),
    })
      .then(action => {
        viewModel.setProperty("source", context.sources[action.id]);
      })
      .catch(console.log);
  }

  page.bindingContext = viewModel;

}
