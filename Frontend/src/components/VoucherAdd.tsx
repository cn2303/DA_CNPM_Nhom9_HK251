import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Plus } from 'lucide-react';

interface VoucherAddProps {
  onBack: () => void;
  onAdd: (voucher: any) => void;
}

export function VoucherAdd({ onBack, onAdd }: VoucherAddProps) {
  const today = new Date().toISOString().split('T')[0];
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    percent: 0,
    maxValue: 0,
    minValue: 0,
    quantity: 0,
    description: '',
    startDate: today,
    endDate: ''
  });

  const handleAdd = () => {
    if (newVoucher.code && newVoucher.percent > 0 && newVoucher.endDate) {
      // Format the voucher object to match API requirements
      const voucherData = {
        code: newVoucher.code,
        startDate: newVoucher.startDate,
        endDate: newVoucher.endDate,
        percent: newVoucher.percent,
        maxValue: newVoucher.maxValue,
        minValue: newVoucher.minValue,
        quantity: newVoucher.quantity,
        description: newVoucher.description,
      };
      onAdd(voucherData);
    }
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
        </div>

        <Card>
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl">Thêm phiếu giảm giá mới</CardTitle>
            <p className="text-muted-foreground mt-2">Tất cả phiếu giảm giá được tính theo phần trăm (%)</p>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Voucher Code */}
              <div className="space-y-3">
                <Label htmlFor="code" className="text-lg">Mã phiếu *</Label>
                <Input
                  id="code"
                  value={newVoucher.code}
                  onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  placeholder="VD: SUMMER2025"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">Mã phiếu sẽ tự động chuyển thành chữ hoa</p>
              </div>

              {/* Percent */}
              <div className="space-y-3">
                <Label htmlFor="percent" className="text-lg">Phần trăm giảm (%) *</Label>
                <Input
                  id="percent"
                  type="number"
                  min="0"
                  max="100"
                  value={newVoucher.percent}
                  onChange={(e) => setNewVoucher({ ...newVoucher, percent: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 10, 20, 30..."
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {newVoucher.percent > 0 
                    ? `Giảm ${newVoucher.percent}% trên giá trị đơn hàng`
                    : 'Nhập phần trăm giảm giá (0-100)'}
                </p>
              </div>

              {/* Min Value */}
              <div className="space-y-3">
                <Label htmlFor="minValue" className="text-lg">Giá trị đơn hàng tối thiểu (VNĐ) *</Label>
                <Input
                  id="minValue"
                  type="number"
                  min="0"
                  value={newVoucher.minValue}
                  onChange={(e) => setNewVoucher({ ...newVoucher, minValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 100000"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {newVoucher.minValue > 0 
                    ? `Phiếu chỉ áp dụng cho đơn hàng từ ${formatCurrency(newVoucher.minValue)}`
                    : 'Nhập 0 nếu không có điều kiện tối thiểu'}
                </p>
              </div>

              {/* Max Value */}
              <div className="space-y-3">
                <Label htmlFor="maxValue" className="text-lg">Giá trị giảm tối đa (VNĐ) *</Label>
                <Input
                  id="maxValue"
                  type="number"
                  min="0"
                  value={newVoucher.maxValue}
                  onChange={(e) => setNewVoucher({ ...newVoucher, maxValue: parseFloat(e.target.value) || 0 })}
                  placeholder="VD: 1000000"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {newVoucher.maxValue > 0 
                    ? `Số tiền giảm tối đa: ${formatCurrency(newVoucher.maxValue)}`
                    : 'Giới hạn số tiền giảm tối đa'}
                </p>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <Label htmlFor="quantity" className="text-lg">Số lượng khả dụng *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newVoucher.quantity}
                  onChange={(e) => setNewVoucher({ ...newVoucher, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="VD: 100"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  {newVoucher.quantity > 0 
                    ? `${newVoucher.quantity} phiếu khả dụng`
                    : 'Số lượng phiếu có thể sử dụng'}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newVoucher.description}
                  onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
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
                  value={newVoucher.startDate}
                  onChange={(e) => setNewVoucher({ ...newVoucher, startDate: e.target.value })}
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  Bắt đầu: {formatDate(newVoucher.startDate)}
                </p>
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <Label htmlFor="endDate" className="text-lg">Ngày kết thúc *</Label>
                <Input
                  id="endDate"
                  type="date"
                  min={newVoucher.startDate}
                  value={newVoucher.endDate}
                  onChange={(e) => setNewVoucher({ ...newVoucher, endDate: e.target.value })}
                  className="h-12"
                />
                {newVoucher.endDate && (
                  <p className="text-sm text-muted-foreground">
                    Phiếu hết hạn vào: {formatDate(newVoucher.endDate)}
                  </p>
                )}
              </div>

              {/* Summary Box */}
              {newVoucher.code && newVoucher.percent > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-2">
                  <h4 className="font-semibold">Tóm tắt phiếu giảm giá:</h4>
                  <p className="text-sm">• Mã: <span className="font-semibold">{newVoucher.code}</span></p>
                  <p className="text-sm">• Giảm: <span className="font-semibold">{newVoucher.percent}%</span></p>
                  <p className="text-sm">• Đơn tối thiểu: <span className="font-semibold">{formatCurrency(newVoucher.minValue)}</span></p>
                  <p className="text-sm">• Giảm tối đa: <span className="font-semibold">{formatCurrency(newVoucher.maxValue)}</span></p>
                  <p className="text-sm">• Số lượng: <span className="font-semibold">{newVoucher.quantity}</span></p>
                </div>
              )}

              {/* Add Button */}
              <div className="pt-6">
                <Button 
                  onClick={handleAdd} 
                  className="w-full h-14 flex items-center justify-center gap-2"
                  disabled={!newVoucher.code || newVoucher.percent <= 0 || !newVoucher.endDate}
                >
                  <Plus className="size-5" />
                  Thêm phiếu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
