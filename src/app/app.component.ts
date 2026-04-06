import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>' // O tu HTML actual
})
export class AppComponent implements OnInit {
  title = 'pesoCabal';
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        // Esto limpia la URL dejando solo /dashboard
        this.router.navigate([], {
          queryParams: { token: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });
  }
}
