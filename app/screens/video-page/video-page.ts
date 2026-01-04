import { Application, fromObject, NavigatedData, Page, Screen, TapGestureEventData, Utils } from "@nativescript/core";
import { Video } from "@nstudio/nativescript-exoplayer";

export function onNavigatingTo(args: NavigatedData) {
  const context = args.context as { source: string; }
  const page = args.object as Page;
  const videoPlayer = <Video> page.getViewById("video_player");
  page.actionBarHidden = true;

  const viewModel = fromObject({
    source: context.source,
    isFullscreen: false,
    toggleFullscreen,
    fullscreenTogglePosition: Screen.mainScreen.widthDIPs - 30
  });

  if (__ANDROID__) {
    const currentActivity = Utils.android.getCurrentActivity();

    currentActivity
      .getWindow()
      .addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

    currentActivity
      .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

    Application.android.on("activityBackPressed", () => {
      videoPlayer?.destroy();

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
      Application.android.off("activityBackPressed");
    });
  }

  function toggleFullscreen(eventData: TapGestureEventData) {
    const newFullscreenState = !viewModel.get('isFullscreen');
    viewModel.set('isFullscreen', newFullscreenState);

    if (__ANDROID__) {
      const currentActivity = Utils.android.getCurrentActivity();
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

    setTimeout(() => {
      eventData.view.left = Screen.mainScreen.widthDIPs - (newFullscreenState ? 100 : 30);
    }, 200);
  }

  page.bindingContext = viewModel;

}
