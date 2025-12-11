import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { categoryAPI } from '../services/api';
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

interface BookEditProps {
  book: Book;
  onBack: () => void;
  onSave: (book: Book) => void;
  onDelete: (bookId: number) => void;
}

export function BookEdit({ book, onBack, onSave, onDelete }: BookEditProps) {
  const [editedBook, setEditedBook] = useState<Book>(book);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [showOriginalDetails, setShowOriginalDetails] = useState(true);

  // Load categories from API and initialize selected categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryAPI.getAll();
        console.log('📚 Loaded categories:', data);
        setCategories(data);
        
        // Set initial selected categories from book
        if (book.categories && book.categories.length > 0) {
          const currentCategoryIds = book.categories.map(bc => bc.category.id);
          setSelectedCategoryIds(currentCategoryIds);
        }
      } catch (err) {
        console.error('❌ Error loading categories:', err);
      }
    };
    loadCategories();
  }, [book.categories]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = () => {
    // Update categories based on selection - format for backend
    const updatedCategories = selectedCategoryIds.map(categoryId => ({
      category: {
        id: categoryId
      }
    }));

    onSave({
      ...editedBook,
      categories: updatedCategories
    });
  };

  const handleDelete = () => {
    onDelete(book.id);
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2 px-6 py-6">
                <Trash2 className="size-5" />
                Xóa sách
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Sách "{book.title}" sẽ bị xóa vĩnh viễn khỏi kho.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Original Book Details - Collapsible */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-blue-900">Thông tin hiện tại của sách</CardTitle>
                <p className="text-sm text-blue-700 mt-1">Xem chi tiết thông tin trước khi chỉnh sửa</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowOriginalDetails(!showOriginalDetails)}
                className="flex items-center gap-2"
              >
                {showOriginalDetails ? (
                  <>
                    <ChevronUp className="size-4" />
                    Ẩn
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-4" />
                    Hiện
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showOriginalDetails && (
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-900">Thông tin cơ bản</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Tên sách</p>
                      <p className="font-medium">{book.title}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tác giả</p>
                      <p className="font-medium">{book.author}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mô tả</p>
                      <p className="font-medium line-clamp-3">{book.description}</p>
                    </div>
                  </div>
                </div>

                {/* Publishing Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-900">Xuất bản</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nhà xuất bản</p>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Năm xuất bản</p>
                      <p className="font-medium">{book.publicationYear}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ISBN</p>
                      <p className="font-medium">{book.isbn || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ngôn ngữ</p>
                      <p className="font-medium">{book.language || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quốc gia</p>
                      <p className="font-medium">{book.nation || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Inventory & Categories */}
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-900">Kho & Thể loại</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Số lượng</p>
                      <p className="font-medium">{book.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Giá</p>
                      <p className="font-medium">{book.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trạng thái</p>
                      <p className="font-medium">{book.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số trang</p>
                      <p className="font-medium">{book.numPage}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Đánh giá</p>
                      <p className="font-medium">{book.averageRating} ⭐</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Thể loại</p>
                      <p className="font-medium">
                        {book.categories && book.categories.length > 0
                          ? book.categories.map(bc => bc.category.name).join(', ')
                          : 'Chưa có'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl">Chỉnh sửa thông tin sách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Book Image */}
              <div className="space-y-6">
                <div className="w-full h-[600px] overflow-hidden rounded-lg bg-muted">
                  <ImageWithFallback
                    src={editedBook.imageUrl || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                    alt={editedBook.title}
                    className="size-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="imageUrl" className="text-lg">URL hình ảnh</Label>
                  <Input
                    id="imageUrl"
                    value={editedBook.imageUrl || ''}
                    onChange={(e) => setEditedBook({ ...editedBook, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Right Column - Book Details */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-xl mb-4">Thông tin cơ bản</h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-lg">Tên sách</Label>
                      <Input
                        id="title"
                        value={editedBook.title}
                        onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                        placeholder="Nhập tên sách"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="author" className="text-lg">Tác giả</Label>
                      <Input
                        id="author"
                        value={editedBook.author}
                        onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                        placeholder="Nhập tên tác giả"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-lg">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={editedBook.description}
                        onChange={(e) => setEditedBook({ ...editedBook, description: e.target.value })}
                        placeholder="Nhập mô tả sách"
                        rows={5}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Publishing Information */}
                <div>
                  <h3 className="text-xl mb-4">Thông tin xuất bản</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="publisher" className="text-lg">Nhà xuất bản</Label>
                      <Input
                        id="publisher"
                        value={editedBook.publisher}
                        onChange={(e) => setEditedBook({ ...editedBook, publisher: e.target.value })}
                        placeholder="Nhập nhà xuất bản"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="publicationYear" className="text-lg">Năm xuất bản</Label>
                      <Input
                        id="publicationYear"
                        type="number"
                        min="1000"
                        max="2100"
                        value={editedBook.publicationYear}
                        onChange={(e) => setEditedBook({ ...editedBook, publicationYear: parseInt(e.target.value) || 2024 })}
                        placeholder="VD: 2024"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="isbn" className="text-lg">ISBN</Label>
                      <Input
                        id="isbn"
                        value={editedBook.isbn || ''}
                        onChange={(e) => setEditedBook({ ...editedBook, isbn: e.target.value })}
                        placeholder="VD: 978-3-16-148410-0"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="language" className="text-lg">Ngôn ngữ</Label>
                      <Input
                        id="language"
                        value={editedBook.language || ''}
                        onChange={(e) => setEditedBook({ ...editedBook, language: e.target.value })}
                        placeholder="VD: Tiếng Việt, English..."
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="nation" className="text-lg">Quốc gia</Label>
                      <Input
                        id="nation"
                        value={editedBook.nation || ''}
                        onChange={(e) => setEditedBook({ ...editedBook, nation: e.target.value })}
                        placeholder="VD: Việt Nam, Mỹ..."
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="type" className="text-lg">Loại sách</Label>
                      <Input
                        id="type"
                        value={editedBook.type}
                        onChange={(e) => setEditedBook({ ...editedBook, type: e.target.value })}
                        placeholder="VD: Tiểu thuyết, Giáo khoa..."
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Physical Specifications */}
                <div>
                  <h3 className="text-xl mb-4">Thông số vật lý</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="numPage" className="text-lg">Số trang</Label>
                      <Input
                        id="numPage"
                        type="number"
                        min="1"
                        value={editedBook.numPage}
                        onChange={(e) => setEditedBook({ ...editedBook, numPage: parseInt(e.target.value) || 0 })}
                        placeholder="Nhập số trang"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="size" className="text-lg">Kích thước</Label>
                      <Input
                        id="size"
                        value={editedBook.size}
                        onChange={(e) => setEditedBook({ ...editedBook, size: e.target.value })}
                        placeholder="VD: 14.5 x 20.5 x 2"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Inventory & Pricing */}
                <div>
                  <h3 className="text-xl mb-4">Kho hàng & Giá</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="quantity" className="text-lg">Số lượng tồn kho</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={editedBook.quantity}
                        onChange={(e) => setEditedBook({ ...editedBook, quantity: parseInt(e.target.value) || 0 })}
                        placeholder="Nhập số lượng tồn kho"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="price" className="text-lg">Giá (VNĐ)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editedBook.price}
                        onChange={(e) => setEditedBook({ ...editedBook, price: parseFloat(e.target.value) || 0 })}
                        placeholder="Nhập giá bán"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="status" className="text-lg">Trạng thái</Label>
                      <Select value={editedBook.status} onValueChange={(value) => setEditedBook({ ...editedBook, status: value })}>
                        <SelectTrigger className="h-12" id="status">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="averageRating" className="text-lg">Đánh giá trung bình</Label>
                      <Input
                        id="averageRating"
                        type="number"
                        value={editedBook.averageRating}
                        readOnly
                        className="h-12 bg-muted cursor-not-allowed"
                      />
                      <p className="text-sm text-muted-foreground">Đánh giá được tính dựa trên phản hồi của khách hàng</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <h3 className="text-xl mb-4">Thể loại</h3>
                  <div className="space-y-3">
                    <Label className="text-lg">Danh mục (có thể chọn nhiều)</Label>
                    <div className="border rounded-lg p-4 space-y-3 bg-background min-h-[120px] max-h-[200px] overflow-y-auto">
                      {categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Đang tải danh mục...</p>
                      ) : (
                        categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`category-edit-${category.id}`}
                              checked={selectedCategoryIds.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                            />
                            <label
                              htmlFor={`category-edit-${category.id}`}
                              className="text-sm cursor-pointer select-none flex-1"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    {selectedCategoryIds.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Đã chọn: {selectedCategoryIds.map(id => categories.find(c => c.id === id)?.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <Button onClick={handleSave} className="w-full h-14 flex items-center justify-center gap-2">
                    <Save className="size-5" />
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
