// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `<h1>Book CRUD App</h1><router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {}
