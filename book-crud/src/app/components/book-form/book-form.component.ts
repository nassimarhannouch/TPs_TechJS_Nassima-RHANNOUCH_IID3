import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  bookId?: number;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Création du formulaire
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required]
    });

    // Récupérer l'ID depuis l'URL
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      // Si l'id existe, charger le livre pour édition
      this.bookService.getBook(this.bookId).subscribe(book => {
        this.bookForm.patchValue(book);
      });
    }
  }

  submit() {
    if (this.bookForm.invalid) return;

    const book: Book = this.bookForm.value;

    if (this.bookId) {
      // Edition
      book.id = this.bookId;
      this.bookService.updateBook(book).subscribe(() => {
        this.router.navigate(['/']); // retour à la liste
      });
    } else {
      // Ajout
      this.bookService.createBook(book).subscribe(() => {
        this.router.navigate(['/']); // retour à la liste
      });
    }
  }
}
