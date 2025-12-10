import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Plus, Ticket, Trash2, Calendar, Percent } from 'lucide-react';
import { Badge } from './ui/badge';

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

interface VoucherInventoryProps {
  vouchers: Voucher[];
  onBack: () => void;
  onAddVoucher: () => void;
  onDeleteVoucher?: () => void;
  onVoucherClick?: (voucherCode: string) => void;
}

export function VoucherInventory({ vouchers, onBack, onAddVoucher, onDeleteVoucher, onVoucherClick }: VoucherInventoryProps) {
  const formatDiscount = (voucher: Voucher) => {
    return `${voucher.percent}% GIẢM`;
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('vi-VN')}₫`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isExpired = (endDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return end < today;
  };

  const isExpiringSoon = (endDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
  };

  return (
    <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 p-12 overflow-auto mx-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 px-6 py-6">
              <ArrowLeft className="size-5" />
              Về bảng điều khiển
            </Button>
            <div className="flex items-center gap-3">
              <Ticket className="size-8 text-primary" />
              <h1 className="text-4xl">Kho phiếu giảm giá</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={onDeleteVoucher} variant="destructive" className="flex items-center gap-2 px-6 py-6">
              <Trash2 className="size-5" />
              Xóa phiếu
            </Button>
            <Button onClick={onAddVoucher} className="flex items-center gap-2 px-6 py-6">
              <Plus className="size-5" />
              Thêm phiếu
            </Button>
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <Card 
              key={voucher.code}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => onVoucherClick?.(voucher.code)}
            >
              <CardContent className="p-6 space-y-4">
                {/* Voucher Logo */}
                <div className="w-full h-32 overflow-hidden rounded-lg bg-muted flex items-center justify-center relative">
                  <Badge variant="secondary" className="bg-orange-500 text-white">
                    <Percent className="size-5" />
                  </Badge>
                  {isExpired(voucher.endDate) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-base px-4 py-2">
                        Đã hết hạn
                      </Badge>
                    </div>
                  )}
                  {!isExpired(voucher.endDate) && isExpiringSoon(voucher.endDate) && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-orange-500 text-white">
                        Sắp hết hạn
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Voucher Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium">{voucher.code}</h3>
                    <div className="px-3 py-1 bg-primary/10 rounded-full">
                      <span className="text-primary">
                        {formatDiscount(voucher)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Khả dụng</span>
                      <span className="font-medium">{voucher.quantity} phiếu</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Đơn tối thiểu</span>
                      <span className="font-medium">
                        {voucher.minValue > 0 ? formatCurrency(voucher.minValue) : 'Không'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Calendar className="size-4" />
                        Hết hạn
                      </span>
                      <span className={`font-medium ${isExpired(voucher.endDate) ? 'text-destructive' : isExpiringSoon(voucher.endDate) ? 'text-orange-500' : ''}`}>
                        {formatDate(voucher.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {vouchers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Ticket className="size-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl text-muted-foreground mb-2">Chưa có phiếu giảm giá</h3>
            <p className="text-muted-foreground mb-6">Bắt đầu bằng cách thêm phiếu giảm giá đầu tiên</p>
            <Button onClick={onAddVoucher} className="flex items-center gap-2">
              <Plus className="size-4" />
              Thêm phiếu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}