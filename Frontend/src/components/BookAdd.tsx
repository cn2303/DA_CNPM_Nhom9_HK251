import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { categoryAPI } from '../services/api';

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

interface BookAddProps {
  onBack: () => void;
  onAdd: (book: Omit<Book, 'id'>) => void;
}

export function BookAdd({ onBack, onAdd }: BookAddProps) {
  const [newBook, setNewBook] = useState({
    isbn: '',
    title: '',
    language: '',
    author: '',
    publisher: '',
    description: '',
    status: 'Active',
    size: '',
    type: '',
    price: 0,
    quantity: 0,
    publicationYear: 2024,
    imageUrl: '',
    categories: [] as BookCategory[],
    numPage: 0,
    nation: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        console.log('📚 Loaded categories:', response);
        setCategories(response);
      } catch (err) {
        console.error('❌ Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAdd = () => {
    if (newBook.title && newBook.author) {
      // Build categories array in the format backend expects
      const bookCategories = selectedCategoryIds.map(categoryId => ({
        category: {
          id: categoryId
        }
      }));

      onAdd({
        ...newBook,
        isbn: newBook.isbn || null,
        language: newBook.language || null,
        imageUrl: newBook.imageUrl || null,
        nation: newBook.nation || null,
        categories: bookCategories
      });
    }
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

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
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl">Thêm sách mới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Book Image */}
              <div className="space-y-6">
                <div className="w-full h-[600px] overflow-hidden rounded-lg bg-muted">
                  <ImageWithFallback
                    src={newBook.imageUrl || placeholderImage}
                    alt="Xem trước sách"
                    className="size-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="imageUrl" className="text-lg">URL hình ảnh</Label>
                  <Input
                    id="imageUrl"
                    value={newBook.imageUrl}
                    onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
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
                      <Label htmlFor="title" className="text-lg">Tên sách *</Label>
                      <Input
                        id="title"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        placeholder="Nhập tên sách"
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="author" className="text-lg">Tác giả *</Label>
                      <Input
                        id="author"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        placeholder="Nhập tên tác giả"
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-lg">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={newBook.description}
                        onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
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
                        value={newBook.publisher}
                        onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
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
                        value={newBook.publicationYear}
                        onChange={(e) => setNewBook({ ...newBook, publicationYear: parseInt(e.target.value) || 2024 })}
                        placeholder="VD: 2024"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="isbn" className="text-lg">ISBN</Label>
                      <Input
                        id="isbn"
                        value={newBook.isbn}
                        onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                        placeholder="VD: 978-3-16-148410-0"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="language" className="text-lg">Ngôn ngữ</Label>
                      <Input
                        id="language"
                        value={newBook.language}
                        onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
                        placeholder="VD: Tiếng Việt, English..."
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="nation" className="text-lg">Quốc gia</Label>
                      <Input
                        id="nation"
                        value={newBook.nation}
                        onChange={(e) => setNewBook({ ...newBook, nation: e.target.value })}
                        placeholder="VD: Việt Nam, Mỹ..."
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="type" className="text-lg">Loại sách</Label>
                      <Input
                        id="type"
                        value={newBook.type}
                        onChange={(e) => setNewBook({ ...newBook, type: e.target.value })}
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
                        value={newBook.numPage || ''}
                        onChange={(e) => setNewBook({ ...newBook, numPage: parseInt(e.target.value) || 0 })}
                        placeholder="Nhập số trang"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="size" className="text-lg">Kích thước</Label>
                      <Input
                        id="size"
                        value={newBook.size}
                        onChange={(e) => setNewBook({ ...newBook, size: e.target.value })}
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
                        value={newBook.quantity}
                        onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 0 })}
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
                        value={newBook.price}
                        onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) || 0 })}
                        placeholder="Nhập giá bán"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="status" className="text-lg">Trạng thái</Label>
                      <Select value={newBook.status} onValueChange={(value) => setNewBook({ ...newBook, status: value })}>
                        <SelectTrigger className="h-12" id="status">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
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
                              id={`category-${category.id}`}
                              checked={selectedCategoryIds.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
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
                  <Button onClick={handleAdd} className="w-full h-14 flex items-center justify-center gap-2">
                    <Plus className="size-5" />
                    Thêm sách
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