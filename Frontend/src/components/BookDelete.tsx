import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useState } from 'react';

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

interface BookDeleteProps {
  books: Book[];
  onBack: () => void;
  onDelete: (bookId: number) => void;
}

export function BookDelete({ books, onBack, onDelete }: BookDeleteProps) {
  const [deletingBookId, setDeletingBookId] = useState<number | null>(null);

  const handleDelete = (bookId: number) => {
    onDelete(bookId);
    setDeletingBookId(null);
  };

  const getStockBadgeColor = (quantity: number) => {
    if (quantity === 0) return '#999';
    if (quantity < 10) return '#e7000b';
    return '#155dfc';
  };

  const getStockLabel = (quantity: number) => {
    if (quantity === 0) return 'Hết hàng';
    if (quantity < 10) return 'Sắp hết';
    return 'Còn hàng';
  };

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
            <ArrowLeft className="size-5" />
            Về bảng điều khiển
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Xóa sách</CardTitle>
            <p className="text-muted-foreground mt-2">Chọn một cuốn sách để xóa khỏi kho</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {books.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Không có sách nào trong kho</p>
                </div>
              ) : (
                books.map((book) => (
                  <Card key={book.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-6 p-6">
                        {/* Book Image */}
                        <div className="flex-shrink-0 w-24 h-32 rounded-md overflow-hidden">
                          <ImageWithFallback
                            src={book.imageUrl || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                            alt={book.title}
                            className="size-full object-cover"
                          />
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 space-y-2">
                          <h3 className="text-xl">{book.title}</h3>
                          <p className="text-muted-foreground">của {book.author}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Tồn kho:</span>
                              <div 
                                className="px-2 py-1 rounded text-xs text-white"
                                style={{ backgroundColor: getStockBadgeColor(book.quantity) }}
                              >
                                {book.quantity} cuốn
                              </div>
                            </div>
                            <span 
                              className="text-sm"
                              style={{ color: getStockBadgeColor(book.quantity) }}
                            >
                              {getStockLabel(book.quantity)}
                            </span>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex-shrink-0">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                className="flex items-center gap-2"
                                onClick={() => setDeletingBookId(book.id)}
                              >
                                <Trash2 className="size-4" />
                                Xóa
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xóa "{book.title}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Hành động này không thể hoàn tác. Sách "{book.title}" của {book.author} sẽ bị xóa vĩnh viễn khỏi kho.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletingBookId(null)}>
                                  Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(book.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Xóa sách
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}