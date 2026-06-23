import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';

/**
 * Auto-advancing hero carousel.
 * Uses CSS for the Ken Burns zoom and a simple interval for slide rotation.
 */
@Component({
  selector: 'app-hero-slider',
  template: `
    <div class="hero-slider">
      @for (img of slides; track img; let i = $index) {
        @if (i === current()) {
          <div class="slide">
            <img class="slide-image" [src]="img" alt="" aria-hidden="true" />
          </div>
        }
      }
      @if (!hideDots()) {
        <ul class="slick-dots" style="position:absolute;bottom:18px;width:100%;display:flex;
            justify-content:center;gap:8px;list-style:none;z-index:3;">
          @for (img of slides; track img; let i = $index) {
            <li>
              <button type="button" (click)="current.set(i)" [attr.aria-label]="'Slide ' + (i + 1)"
                      style="width:10px;height:10px;border-radius:50%;border:none;"
                      [style.background]="i === current() ? 'var(--search-button-color)' : 'rgba(255,255,255,0.6)'">
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class HeroSlider implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly hideDots = input(false);

  protected readonly slides = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=70',
    'https://images.unsplash.com/photo-1612801798930-288967b6d1e?w=1600&q=70',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&q=70',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1600&q=70',
  ];
  protected readonly current = signal(0);

  ngOnInit(): void {
    const id = setInterval(() => {
      this.current.update((c) => (c + 1) % this.slides.length);
    }, 4000);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }
}
