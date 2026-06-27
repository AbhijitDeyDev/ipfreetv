import { Header } from "@/app/components/header/header";
import { Component, inject, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ImgDirective } from "@nativescript-community/ui-image/angular";
import {
  NativeScriptCommonModule,
  RouterExtensions,
} from "@nativescript/angular";
import { getChannelCategories } from "../../common/helpers";

const categories = getChannelCategories();

@Component({
  selector: "category-screen",
  templateUrl: "category.html",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [NativeScriptCommonModule, ImgDirective, Header],
})
export class CategoryScreen {
  private router = inject(RouterExtensions);

  items = signal<{ name: string; count: number }[]>(categories);

  onCategoryTap(event: any) {
    this.router.navigate(["channel_by_category"], {
      queryParams: { category: this.items()[event.index].name },
      transition: { name: 'slide' },
    });
  }

  onSearchInputChange(searchInput: string) {
    this.items.set(
      searchInput.trim().length
        ? categories.filter(({ name }) =>
          name.toLowerCase().includes(searchInput),
        )
        : categories,
    );
  }
}
