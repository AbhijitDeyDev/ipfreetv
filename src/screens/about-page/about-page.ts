import { alert, EventData, File, fromObject, Page } from "@nativescript/core";
import aboutHtml from "./about-html";
import { getAppVersion } from "../../common/helpers";
import { GITHUB_DETAILS } from "../../common/constant";

export function navigatingTo(args: EventData) {
  const page = <Page> args.object;
  page.actionBarHidden = true;
  const viewModel = fromObject({
    aboutHtml: ''
  });

  try {
    let aboutFileText = aboutHtml;
    const appVersion = getAppVersion();
    aboutFileText = aboutFileText.replace('{VERSION}', appVersion);
    aboutFileText = aboutFileText.replaceAll('{GITHUB_USERNAME}', GITHUB_DETAILS.UserName);
    aboutFileText = aboutFileText.replaceAll('{GITHUB_APP_NAME}', GITHUB_DETAILS.AppName);
    viewModel.set('aboutHtml', aboutFileText);
  } catch {
    alert("Unable to show info about app");
  }


  page.bindingContext = viewModel;
}
