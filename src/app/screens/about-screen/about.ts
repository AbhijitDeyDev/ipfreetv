import { Header } from '@/app/components/header/header';
import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ImgDirective } from '@nativescript-community/ui-image/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { GITHUB_DETAILS } from '../../common/constant';
import { getAppVersion } from '../../common/helpers';
import aboutHtml from "./about-html";

@Component({
  selector: 'about-screen',
  templateUrl: 'about.html',
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, Header, ImgDirective]
})

export class AboutScreen {
  aboutHtml = signal<string>('');

  constructor() {
    try {
      let aboutFileText = aboutHtml;
      const appVersion = getAppVersion();
      aboutFileText = aboutFileText.replace('{VERSION}', appVersion);
      aboutFileText = aboutFileText.replaceAll('{GITHUB_USERNAME}', GITHUB_DETAILS.UserName);
      aboutFileText = aboutFileText.replaceAll('{GITHUB_APP_NAME}', GITHUB_DETAILS.AppName);
      this.aboutHtml.set(aboutFileText);
    } catch {
      alert("Unable to show info about app");
    }
  }

}
