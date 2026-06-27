import { withInterceptorsFromDi } from "@angular/common/http";
import { provideZonelessChangeDetection } from "@angular/core";
import { initialize } from "@nativescript-community/ui-image";
import {
  bootstrapApplication,
  provideNativeScriptHttpClient,
  provideNativeScriptRouter,
  runNativeScriptAngularApp,
} from "@nativescript/angular";
import { App } from "./app/app";
import { routes } from "./app/app.routes";

initialize({ isDownsampleEnabled: true });

runNativeScriptAngularApp({
  appModuleBootstrap: () => {
    return bootstrapApplication(App, {
      providers: [
        provideNativeScriptHttpClient(withInterceptorsFromDi()),
        provideNativeScriptRouter(routes),
        provideZonelessChangeDetection(),
      ],
    });
  },
});
