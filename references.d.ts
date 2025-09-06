/// <reference path="./node_modules/@nativescript/types/index.d.ts" />

import { EventData as ED, NavigatedData as ND, ItemEventData as IED, ShownModallyData as SMD, Page } from "@nativescript/core";

type PageData = {
  object: {
    page: Page;
  };
};

export type EventData = ED & PageData;

export type NavigatedData = ND & PageData;

export type ItemEventData = IED & PageData;

export type ShownModallyData = SMD & PageData;
