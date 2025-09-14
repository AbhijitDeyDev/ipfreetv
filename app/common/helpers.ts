import { Frame, Page } from "@nativescript/core";

export function getTopFrame(page: Page) {
  if (page.frame.page)
    return getTopFrame(page.frame.page);
  return page.frame;
}
