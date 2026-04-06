import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true, // <--- Esto es lo que permite usarlo en app.routes.ts
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent { }
