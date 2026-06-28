import { Icon } from "@/app/components/icon/icon";
import { RippleContainer } from "@/app/components/ripple-container/ripple-container";
import {
  Component,
  inject,
  input,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  OnInit,
  output,
  signal,
} from "@angular/core";
import {
  NativeScriptCommonModule,
  RouterExtensions,
} from "@nativescript/angular";
import {
  AndroidActivityBackPressedEventData,
  Application,
  Color,
  Page,
} from "@nativescript/core";

@Component({
  selector: "header",
  templateUrl: "header.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, RippleContainer, Icon],
})
export class Header implements OnInit, OnDestroy {
  private router = inject(RouterExtensions);
  private page = inject(Page);

  title = input<string>();
  hideBackBtn = input<boolean>(false);
  showSearch = input<boolean>(false);
  searchInputChange = output<string>();
  searchBarHint = input("Search channels...");

  searchMode = signal(false);
  searchBarText = signal("");

  ngOnInit(): void {
    this.page.actionBarHidden = true;
    this.page.androidStatusBarBackground = new Color("#08cb00");

    if (__ANDROID__) {
      Application.android.on(
        Application.android.activityBackPressedEvent,
        (args: AndroidActivityBackPressedEventData) => {
          if (this.searchMode()) {
            this.toggleSearchMode();
            args.cancel = true;
          }
        },
      );
    }
  }

  ngOnDestroy(): void {
    if (__ANDROID__) {
      Application.android.off(Application.android.activityBackPressedEvent);
    }
  }

  goBack() {
    this.router.back();
  }

  goToAbout() {
    this.router.navigateByUrl("about", { transition: { name: 'slide' } });
  }

  toggleSearchMode() {
    this.searchInputChange?.emit("");
    this.searchBarText.set("");
    this.searchMode.update((sm) => !sm);
  }

  onSearchInputChange(event: any) {
    this.searchBarText.set(event.value);
    this.searchInputChange?.emit(event.value);
  }
}
