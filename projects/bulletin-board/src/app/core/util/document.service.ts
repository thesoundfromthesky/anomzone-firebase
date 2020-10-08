import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private r2: Renderer2;
  constructor(
    @Inject(DOCUMENT) private readonly d: Document,
    private readonly rf2: RendererFactory2
  ) {
    this.r2 = this.rf2.createRenderer(null, null);
  }

  bodyAddClass(name: string): void {
    this.r2.addClass(this.d.body, name);
  }

  bodyRemoveClass(name: string): void {
    this.r2.removeClass(this.d.body, name);
  }

  refreshToHome() {
    const location = this.d.location;
    location.href = location.origin;
  }
}
