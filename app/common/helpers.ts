import { Page, Utils } from "@nativescript/core";

export function getTopFrame(page: Page) {
  if (page.frame.page)
    return getTopFrame(page.frame.page);
  return page.frame;
}

export function getAppVersion() {
  if (__ANDROID__) {
    const packageManager = android.content.pm.PackageManager;
    const packageInfo = Utils.android
      .getApplicationContext()
      .getPackageManager()
      .getPackageInfo(
        Utils.android.getApplicationContext().getPackageName(),
        packageManager.GET_META_DATA
      );
    return packageInfo.versionName;
  } else if (__IOS__) {
    return String(NSBundle.mainBundle.objectForInfoDictionaryKey('CFBundleVersion'));
  }
}

export function compareSemver(a: string, b: string) {
  const partsA = a.replace(/^v/, '').split('.').map(Number);
  const partsB = b.replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0);
    if (diff > 0) return 1;
    if (diff < 0) return -1;
  }
  return 0;
}
