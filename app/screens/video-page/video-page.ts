import { Application, fromObject, Image, NavigatedData, Page, ShownModallyData, TapGestureEventData } from "@nativescript/core";
import { Video, VideoFill } from "@nstudio/nativescript-exoplayer";
import { getCurrentActivity } from "@nativescript/core/utils/android";

export function onNavigatingTo(args: NavigatedData) {
  const context = args.context as { source: string; }
  const page = args.object as Page;
  const videoPlayer = <Video> page.getViewById("video_player");
  page.actionBarHidden = true;

  const viewModel = fromObject({
    source: context.source,
    isFullscreen: false,
    toggleFullscreen
  });

  if (__ANDROID__) {

    getCurrentActivity()
      .getWindow()
      .addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

    getCurrentActivity()
      .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

    Application.android.on("activityBackPressed", () => {
      videoPlayer?.destroy();

      if (viewModel.get('isFullscreen')) {
        getCurrentActivity()
          .getWindow()
          .getInsetsController()
          .show(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

        getCurrentActivity()
          .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
      }

      getCurrentActivity()
        .getWindow()
        .clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
      Application.android.off("activityBackPressed");
    });
  }

  function toggleFullscreen(eventData: TapGestureEventData) {

    const newFullscreenState = !viewModel.get('isFullscreen');
    viewModel.set('isFullscreen', newFullscreenState);

    eventData.view.left = newFullscreenState ? 775 : 380;

    if (__ANDROID__) {
      if (newFullscreenState) {
        getCurrentActivity()
          .getWindow()
          .getInsetsController()
          .hide(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

        getCurrentActivity()
          .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
      } else {
        getCurrentActivity()
          .getWindow()
          .getInsetsController()
          .show(android.view.WindowInsetsController.BEHAVIOR_DEFAULT);

        getCurrentActivity()
          .setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
      }
    }
  }

  page.bindingContext = viewModel;

}
