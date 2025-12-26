import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },   // ← la liste des livres à la racine
  { path: 'add', component: BookFormComponent }, // ajouter un livre
  { path: 'edit/:id', component: BookFormComponent } // modifier un livre
];
