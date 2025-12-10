import { useNavigate } from 'react-router-dom';
import { BookAdd } from '../components/BookAdd';
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

interface AddBookProps {
  onAdd: (book: Omit<Book, 'id'>) => Promise<void>;
}

export function AddBook({ onAdd }: AddBookProps) {
  const navigate = useNavigate();

  const handleAdd = async (newBook: Omit<Book, 'id'>) => {
    try {
      await onAdd(newBook);
      toast.success('Đã thêm sách thành công!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Không thể thêm sách');
    }
  };

  return (
    <BookAdd
      onBack={() => navigate('/')}
      onAdd={handleAdd}
    />
  );
}