import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  imports: [RouterLink],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  @Input() pageTitle: string = 'Dashboard';
  @Input() showBreadcrumb: boolean = true;
  @Input() breadcrumbs: { label: string; link?: string }[] = [];
}
