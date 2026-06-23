import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category';

/** Mega footer with category links and social icons. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer implements OnInit {
  private readonly categoryService = inject(CategoryService);

  protected readonly categories = this.categoryService.categories;
  protected readonly year = 2026;

  ngOnInit(): void {
    this.categoryService.loadAll().subscribe({ error: () => {} });
  }
}
