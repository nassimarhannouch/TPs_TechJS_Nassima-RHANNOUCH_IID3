// Book.ts
export enum BookStatus {
  Read = "Read",
  ReRead = "Re-read",
  DNF = "DNF",
  CurrentlyReading = "Currently reading",
  ReturnedUnread = "Returned Unread",
  WantToRead = "Want to read"
}

export enum BookFormat {
  Print = "Print",
  PDF = "PDF",
  Ebook = "Ebook",
  AudioBook = "AudioBook"
}

export class Book {
  title: string;
  author: string;
  numberOfPages: number;
  status: BookStatus;
  price: number;
  pagesRead: number;
  format: BookFormat;
  suggestedBy: string;
  finished: boolean;

  constructor(
    title: string,
    author: string,
    numberOfPages: number,
    status: BookStatus,
    price: number,
    pagesRead: number,
    format: BookFormat,
    suggestedBy: string,
    finished: boolean = false
  ) {
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.status = status;
    this.price = price;
    this.pagesRead = Math.min(pagesRead, numberOfPages);
    this.format = format;
    this.suggestedBy = suggestedBy;
    this.finished = finished;

    // Auto-update finished when pages read equals total pages
    if (this.pagesRead === this.numberOfPages) {
      this.finished = true;
    }
  }

  currentlyAt(): number {
    return Math.round((this.pagesRead / this.numberOfPages) * 100);
  }

  deleteBook(): void {
    console.log(`Book "${this.title}" has been deleted`);
  }

  updatePagesRead(pages: number): void {
    this.pagesRead = Math.min(pages, this.numberOfPages);
    if (this.pagesRead === this.numberOfPages) {
      this.finished = true;
    }
  }
}