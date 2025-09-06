import { Application, fromObject } from "@nativescript/core";
import { ShownModallyData } from "../../../references";
import { Video, VideoFill } from "@nstudio/nativescript-exoplayer";

export function onShownModally(args: ShownModallyData) {
  const context = args.context as { source: string; }
  const videoPlayer = <Video> args.object.page.getViewById("video_player");

  const viewModel = fromObject({
    source: context.source
  });

  videoPlayer.fill = Application.orientation() === 'landscape' ? VideoFill.fill : VideoFill.default;

  Application.on("orientationChanged", ({ newValue }) => {
    videoPlayer.fill = newValue === 'landscape' ? VideoFill.fill : VideoFill.default;
  });

  Application.android.on("activityBackPressed", () => {
    videoPlayer?.destroy();

    Application.off("orientationChanged");
    Application.android.off("activityBackPressed");
  });

  args.object.page.bindingContext = viewModel;
}
