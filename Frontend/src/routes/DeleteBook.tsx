import { useNavigate } from 'react-router-dom';
import { BookDelete } from '../components/BookDelete';
import { toast } from 'sonner@2.0.3';

interface Category {
  id: number;
  name: string;
}

interface BookCategory {
  id: {
    bookId: number;
    categoryId: number;
  };
  category: Category;
}

interface Book {
  id: number;
  isbn: string | null;
  title: string;
  language: string | null;
  author: string;
  publisher: string;
  description: string;
  status: string;
  size: string;
  type: string;
  price: number;
  quantity: number;
  publicationYear: number;
  imageUrl: string | null;
  categories: BookCategory[];
  numPage: number;
  averageRating: number;
  nation: string | null;
}

interface DeleteBookProps {
  books: Book[];
  onDelete: (bookId: number) => void;
}

export function DeleteBook({ books, onDelete }: DeleteBookProps) {
  const navigate = useNavigate();

  const handleDelete = async (bookId: number) => {
    try {
      const bookToDelete = books.find(b => b.id === bookId);
      await onDelete(bookId);
      toast.success(`"${bookToDelete?.title}" đã được xóa`);
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa sách');
    }
  };

  return (
    <BookDelete
      books={books}
      onBack={() => navigate('/')}
      onDelete={handleDelete}
    />
  );
}