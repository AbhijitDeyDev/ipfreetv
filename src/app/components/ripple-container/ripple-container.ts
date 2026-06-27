import { Component, NO_ERRORS_SCHEMA, output } from "@angular/core";
import { MaterialRippleDirective } from "@nativescript-community/ui-material-ripple/angular";
import { NativeScriptCommonModule } from "@nativescript/angular";

@Component({
  selector: "ripple-container",
  template: `<GridLayout (tap)="onTap()">
    <ng-content></ng-content>
    <MDRipple rippleColor="black"></MDRipple>
  </GridLayout>`,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, MaterialRippleDirective],
})
export class RippleContainer {
  press = output();

  onTap() {
    setTimeout(() => this.press.emit(), 200);
  }
}
