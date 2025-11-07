// mongoService.ts
import { MongoClient, Db, Collection } from 'mongodb';
import { Book } from './Book';

export class MongoService {
  private client: MongoClient;
  private db: Db | null = null;
  private booksCollection: Collection<Book> | null = null; 

  constructor(connectionString: string, dbName: string) {
    this.client = new MongoClient(connectionString);
  }

  async connect(dbName: string): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.booksCollection = this.db.collection<Book>('books'); 
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async addBook(book: Book): Promise<void> {
    if (!this.booksCollection) {
      throw new Error('Database not connected');
    }
    await this.booksCollection.insertOne(book);
  }

  async getAllBooks(): Promise<Book[]> {
    if (!this.booksCollection) {
      throw new Error('Database not connected');
    }
    return await this.booksCollection.find({}).toArray(); 
  }

  async updateBook(title: string, updatedData: Partial<Book>): Promise<void> {
    if (!this.booksCollection) {
      throw new Error('Database not connected');
    }
    await this.booksCollection.updateOne({ title }, { $set: updatedData });
  }

  async deleteBook(title: string): Promise<void> {
    if (!this.booksCollection) {
      throw new Error('Database not connected');
    }
    await this.booksCollection.deleteOne({ title });
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
