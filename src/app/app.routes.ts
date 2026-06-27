import { Routes } from "@angular/router";
import { AboutScreen } from "./screens/about-screen/about";
import { ChannelByCategoryScreen } from "./screens/channel-by-category-screen/channel-by-category";
import { MainScreen } from "./screens/main-screen/main";
import { VideoPlayerScreen } from "./screens/video-player-screen/video-player";

export const routes: Routes = [
  {
    path: "",
    component: MainScreen,
  },
  {
    path: "channel_by_category",
    component: ChannelByCategoryScreen,
  },
  {
    path: "video_player",
    component: VideoPlayerScreen,
  },
  {
    path: 'about',
    component: AboutScreen,
  }
];
