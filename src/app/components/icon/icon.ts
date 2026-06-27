import { Component, input, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";

@Component({
  selector: "icon",
  template: `<Label
    [text]="ICONS[name()]"
    [class]="'lucide ' + class()"
  ></Label>`,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule],
})
export class Icon {
  ICONS = {
    search: "\uE151",
    "arrow-left": "\uE048",
  };

  name = input<keyof typeof this.ICONS>();
  class = input<string>();
}
