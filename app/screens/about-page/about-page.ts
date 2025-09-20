import { alert, EventData, File, fromObject, Page } from "@nativescript/core";
import { getApplicationContext } from "@nativescript/core/utils/android";
import aboutHtml from "./about-html";

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
    viewModel.set('aboutHtml', aboutFileText);
  } catch {
    alert("Unable to show info about app");
  }


  page.bindingContext = viewModel;
}

function getAppVersion() {
  if (__ANDROID__) {
    const packageManager = android.content.pm.PackageManager;
    const packageInfo = getApplicationContext()
      .getPackageManager()
      .getPackageInfo(getApplicationContext().getPackageName(), packageManager.GET_META_DATA);
    return packageInfo.versionName;
  } else if (__IOS__) {
    return String(NSBundle.mainBundle.objectForInfoDictionaryKey('CFBundleVersion'));
  }
}
