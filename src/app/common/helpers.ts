import IndianChannels from "@/assets/json/IndianChannels.json";
import { Utils } from "@nativescript/core";

export function getChannelCategories() {
  const categories: Record<string, number> = {};
  IndianChannels.forEach(({ "group-title": groupTitle }) => {
    const groupTitles = groupTitle.trim().length
      ? groupTitle.split(";")
      : ["Others"];
    groupTitles.forEach((gTitle) => {
      if (Object.hasOwn(categories, gTitle)) categories[gTitle]++;
      else categories[gTitle] = 1;
    });
  });
  return Object.entries(categories).map(([key, value]) => ({
    name: key,
    count: value,
  }));
}

export function getChannelsByCategory(category: string) {
  return IndianChannels.filter(
    (channel) =>
      (category === "Others" && !channel["group-title"].trim().length) ||
      channel["group-title"].includes(category),
  );
}

export function getAppVersion() {
  if (__ANDROID__) {
    const packageManager = android.content.pm.PackageManager;
    const packageInfo = Utils.android
      .getApplicationContext()
      .getPackageManager()
      .getPackageInfo(
        Utils.android.getApplicationContext().getPackageName(),
        packageManager.GET_META_DATA,
      );
    return packageInfo.versionName;
  } else if (__IOS__) {
    return String(
      NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleVersion"),
    );
  } else return "Unknown";
}

export function compareSemver(a: string, b: string) {
  const partsA = a.replace(/^v/, "").split(".").map(Number);
  const partsB = b.replace(/^v/, "").split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0);
    if (diff > 0) return 1;
    if (diff < 0) return -1;
  }
  return 0;
}
