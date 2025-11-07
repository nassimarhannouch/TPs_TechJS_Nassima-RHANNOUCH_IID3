// server.ts
import express, { Request, Response } from 'express';
import { MongoService } from './mongoService';
import { Book, BookStatus, BookFormat } from './Book';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const mongoService = new MongoService(
  'mongodb://127.0.0.1:27017',
  'bookTracker'
);

mongoService.connect('bookTracker').catch(console.error);


// GET all books
app.get('/api/books', async (req: Request, res: Response) => {
  try {
    const books = await mongoService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// POST add new book
app.post('/api/books', async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      numberOfPages,
      status,
      price,
      pagesRead,
      format,
      suggestedBy,
      finished
    } = req.body;

    const book = new Book(
      title,
      author,
      numberOfPages,
      status as BookStatus,
      price,
      pagesRead,
      format as BookFormat,
      suggestedBy,
      finished
    );

    await mongoService.addBook(book);
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// PUT update book
app.put('/api/books/:title', async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const updatedData = req.body;

    if (updatedData.pagesRead && updatedData.numberOfPages) {
      if (updatedData.pagesRead >= updatedData.numberOfPages) {
        updatedData.finished = true;
      }
    }

    await mongoService.updateBook(title, updatedData);
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE book
app.delete('/api/books/:title', async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    await mongoService.deleteBook(title);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// GET statistics
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const books = await mongoService.getAllBooks();
    const stats = {
      totalBooks: books.length,
      finishedBooks: books.filter(b => b.finished).length,
      totalPagesRead: books.reduce((sum, b) => sum + b.pagesRead, 0),
      totalPages: books.reduce((sum, b) => sum + b.numberOfPages, 0)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await mongoService.close();
  process.exit(0);
});