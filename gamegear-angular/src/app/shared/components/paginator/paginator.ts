import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services/search';

/**
 * Client-side pagination control driven by SearchService signals.
 * Shows an item-count summary, a page-size selector, and a windowed page list
 * (first/last + a few pages around the current one, with ellipsis) so the control
 * stays compact even with many pages.
 */
@Component({
  selector: 'app-paginator',
  imports: [FormsModule],
  template: `
    @if (totalItems() > 0) {
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-4">
        <!-- Item count summary -->
        <span class="text-muted small">
          Showing {{ startItem() }}–{{ endItem() }} of {{ totalItems() }}
        </span>

        <!-- Page navigation (only when more than one page) -->
        @if (totalPages() > 1) {
          <nav aria-label="Product pages">
            <ul class="pagination mb-0">
              <li class="page-item" [class.disabled]="currentPage() === 1">
                <button type="button" class="page-link" (click)="goTo(currentPage() - 1)"
                        aria-label="Previous page">&laquo;</button>
              </li>
              @for (page of pages(); track $index) {
                @if (page === ELLIPSIS) {
                  <li class="page-item disabled">
                    <span class="page-link">&hellip;</span>
                  </li>
                } @else {
                  <li class="page-item" [class.active]="page === currentPage()">
                    <button type="button" class="page-link" (click)="goTo(page)"
                            [attr.aria-current]="page === currentPage() ? 'page' : null">
                      {{ page }}
                    </button>
                  </li>
                }
              }
              <li class="page-item" [class.disabled]="currentPage() === totalPages()">
                <button type="button" class="page-link" (click)="goTo(currentPage() + 1)"
                        aria-label="Next page">&raquo;</button>
              </li>
            </ul>
          </nav>
        }

        <!-- Page-size selector -->
        <div class="d-flex align-items-center gap-2">
          <label class="text-muted small mb-0" for="pageSize">Per page</label>
          <select id="pageSize" class="form-select form-select-sm" style="width: auto;"
                  [ngModel]="itemsPerPage()" (ngModelChange)="changePageSize($event)">
            @for (size of pageSizeOptions; track size) {
              <option [ngValue]="size">{{ size }}</option>
            }
          </select>
        </div>
      </div>
    }
  `,
})
export class Paginator {
  private readonly search = inject(SearchService);

  protected readonly ELLIPSIS = -1;
  protected readonly pageSizeOptions = [12, 24, 48];

  protected readonly currentPage = this.search.currentPage;
  protected readonly itemsPerPage = this.search.itemsPerPage;
  protected readonly totalItems = this.search.totalItems;

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage())),
  );

  /** 1-based index of the first item shown on the current page. */
  protected readonly startItem = computed(() =>
    this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.itemsPerPage() + 1,
  );

  /** 1-based index of the last item shown on the current page. */
  protected readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems()),
  );

  /**
   * Windowed page list: always shows page 1 and the last page, plus the current
   * page with one neighbour either side, inserting ELLIPSIS where pages are skipped.
   */
  protected readonly pages = computed<number[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 1;

    const window = new Set<number>([1, total]);
    for (let p = current - delta; p <= current + delta; p++) {
      if (p >= 1 && p <= total) {
        window.add(p);
      }
    }

    const sorted = Array.from(window).sort((a, b) => a - b);
    const result: number[] = [];
    let previous = 0;
    for (const p of sorted) {
      if (p - previous > 1) {
        result.push(this.ELLIPSIS);
      }
      result.push(p);
      previous = p;
    }
    return result;
  });

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.search.currentPage.set(page);
  }

  changePageSize(size: number): void {
    this.search.itemsPerPage.set(size);
    // Reset to the first page so the user isn't stranded on a now-out-of-range page.
    this.search.currentPage.set(1);
  }
}
