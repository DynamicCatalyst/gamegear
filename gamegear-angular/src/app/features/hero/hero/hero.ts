import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../../core/services/search';
import { SearchBar } from '../../search/search-bar/search-bar';
import { HeroSlider } from '../../../shared/components/hero-slider/hero-slider';

/** Hero banner with slider, search bar, and CTA buttons. */
@Component({
  selector: 'app-hero',
  imports: [RouterLink, SearchBar, HeroSlider],
  template: `
    <section class="hero">
      <app-hero-slider [hideDots]="search.isImgSearchActive()" />
      <div class="hero-content">
        <h1 class="hero-heading">
          Level up with <span class="hero-highlight">GameGear</span>
        </h1>
        <p class="hero-subtitle">Consoles, controllers, and PC gear — all in one place.</p>

        <app-search-bar [showImageSearch]="true" />

        @if (!search.isImgSearchActive()) {
          <div class="home-button-container mt-3">
            <a routerLink="/products" class="home-shop-button">Shop Now</a>
            <a routerLink="/products" class="deals-button">Today's Deals</a>
          </div>
        }
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly search = inject(SearchService);
}
