import { Directive, Input, OnInit } from '@angular/core';
import { RouterService } from '@src/app/core/util';

@Directive({
  selector: '[appAnchorScroll]',
})
export class AnchorScrollDirective implements OnInit {
  @Input('id') id!: string;

  constructor(private readonly rs: RouterService) {}

  ngOnInit(): void {
    if (this.id) {
      this.rs.anchorScroll(this.id);
    }
  }
}
