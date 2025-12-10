import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
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

interface Voucher {
  code: string;
  startDate: string;
  endDate: string;
  percent: number;
  maxValue: number;
  minValue: number;
  quantity: number;
  description: string;
  user: {
    id: number;
  };
}

interface VoucherEditProps {
  voucher: Voucher;
  onBack: () => void;
  onSave: (voucher: Voucher) => void;
  onDelete: (voucherCode: string) => void;
}

export function VoucherEdit({ voucher, onBack, onSave, onDelete }: VoucherEditProps) {
  const [editedVoucher, setEditedVoucher] = useState<Voucher>(voucher);

  const handleSave = () => {
    onSave(editedVoucher);
  };

  const handleDelete = () => {
    onDelete(voucher.code);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('vi-VN')}₫`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
            <ArrowLeft className="size-5" />
            Về kho phiếu giảm giá
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2 px-6 py-6">
                <Trash2 className="size-5" />
                Xóa phiếu
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn phiếu giảm giá "{voucher.code}" khỏi hệ thống của bạn.
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

        <Card>
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl">Chỉnh sửa chi tiết phiếu</CardTitle>
            <p className="text-muted-foreground mt-2">Tất cả phiếu giảm giá được tính theo phần trăm (%)</p>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Voucher Code (Read-only) */}
              <div className="space-y-3">
                <Label htmlFor="code" className="text-lg">Mã phiếu</Label>
                <Input
                  id="code"
                  value={editedVoucher.code}
                  readOnly
                  className="h-12 bg-muted cursor-not-allowed"
                />
                <p className="text-sm text-muted-foreground">Mã phiếu không thể thay đổi</p>
              </div>

              {/* Percent */}
              <div className="space-y-3">
                <Label htmlFor="percent" className="text-lg">Phần trăm giảm (%)</Label>
                <Input
                  id="percent"
                  type="number"
                  min="0"
                  max="100"
                  value={editedVoucher.percent}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, percent: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 10, 20, 30..."
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {editedVoucher.percent > 0 
                    ? `Giảm ${editedVoucher.percent}% trên giá trị đơn hàng`
                    : 'Nhập phần trăm giảm giá (0-100)'}
                </p>
              </div>

              {/* Min Value */}
              <div className="space-y-3">
                <Label htmlFor="minValue" className="text-lg">Giá trị đơn hàng tối thiểu (VNĐ)</Label>
                <Input
                  id="minValue"
                  type="number"
                  min="0"
                  value={editedVoucher.minValue}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, minValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 100000"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {editedVoucher.minValue > 0 
                    ? `Phiếu chỉ áp dụng cho đơn hàng từ ${formatCurrency(editedVoucher.minValue)}`
                    : 'Nhập 0 nếu không có điều kiện tối thiểu'}
                </p>
              </div>

              {/* Max Value */}
              <div className="space-y-3">
                <Label htmlFor="maxValue" className="text-lg">Giá trị giảm tối đa (VNĐ)</Label>
                <Input
                  id="maxValue"
                  type="number"
                  min="0"
                  value={editedVoucher.maxValue}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, maxValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 1000000"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {editedVoucher.maxValue > 0 
                    ? `Số tiền giảm tối đa: ${formatCurrency(editedVoucher.maxValue)}`
                    : 'Giới hạn số tiền giảm tối đa'}
                </p>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <Label htmlFor="quantity" className="text-lg">Số lượng khả dụng</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={editedVoucher.quantity}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="VD: 100"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {editedVoucher.quantity > 0 
                    ? `${editedVoucher.quantity} phiếu khả dụng`
                    : 'Số lượng phiếu có thể sử dụng'}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg">Mô tả</Label>
                <Textarea
                  id="description"
                  value={editedVoucher.description}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, description: e.target.value })}
                  placeholder="VD: 10% off cho khách hàng mới"
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-3">
                <Label htmlFor="startDate" className="text-lg">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editedVoucher.startDate}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, startDate: e.target.value })}
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  Bắt đầu: {formatDate(editedVoucher.startDate)}
                </p>
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <Label htmlFor="endDate" className="text-lg">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  min={editedVoucher.startDate}
                  value={editedVoucher.endDate}
                  onChange={(e) => setEditedVoucher({ ...editedVoucher, endDate: e.target.value })}
                  className="h-12"
                />
                {editedVoucher.endDate && (
                  <p className="text-sm text-muted-foreground">
                    Phiếu hết hạn vào: {formatDate(editedVoucher.endDate)}
                  </p>
                )}
              </div>

              {/* Summary Box */}
              {editedVoucher.code && editedVoucher.percent > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-2">
                  <h4 className="font-semibold">Tóm tắt phiếu giảm giá:</h4>
                  <p className="text-sm">• Mã: <span className="font-semibold">{editedVoucher.code}</span></p>
                  <p className="text-sm">• Giảm: <span className="font-semibold">{editedVoucher.percent}%</span></p>
                  <p className="text-sm">• Đơn tối thiểu: <span className="font-semibold">{formatCurrency(editedVoucher.minValue)}</span></p>
                  <p className="text-sm">• Giảm tối đa: <span className="font-semibold">{formatCurrency(editedVoucher.maxValue)}</span></p>
                  <p className="text-sm">• Số lượng: <span className="font-semibold">{editedVoucher.quantity}</span></p>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-6">
                <Button onClick={handleSave} className="w-full h-14 flex items-center justify-center gap-2">
                  <Save className="size-5" />
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
