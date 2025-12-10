import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Trash2, Percent, DollarSign } from 'lucide-react';
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

interface VoucherDeleteProps {
  vouchers: Voucher[];
  onBack: () => void;
  onDelete: (voucherCode: string) => void;
}

export function VoucherDelete({ vouchers, onBack, onDelete }: VoucherDeleteProps) {
  const [deletingVoucherCode, setDeletingVoucherCode] = useState<string | null>(null);

  const handleDelete = (voucherCode: string) => {
    onDelete(voucherCode);
    setDeletingVoucherCode(null);
  };

  const formatDiscount = (voucher: Voucher) => {
    return `${voucher.percent}% GIẢM`;
  };

  const getQuantityBadgeColor = (quantity: number) => {
    if (quantity === 0) return 'bg-gray-500';
    if (quantity < 10) return 'bg-red-500';
    return 'bg-green-500';
  };

  const getQuantityLabel = (quantity: number) => {
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
            Về kho phiếu giảm giá
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Xóa phiếu giảm giá</CardTitle>
            <p className="text-muted-foreground mt-2">Chọn một phiếu giảm giá để xóa khỏi kho</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {vouchers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Không có phiếu giảm giá nào trong kho</p>
                </div>
              ) : (
                vouchers.map((voucher) => (
                  <Card key={voucher.code} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-6 p-6">
                        {/* Voucher Logo */}
                        <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Percent className="size-12 text-primary" />
                        </div>

                        {/* Voucher Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl">{voucher.code}</h3>
                            <Badge variant="secondary" className="text-sm">
                              {formatDiscount(voucher)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {voucher.description || 'Giảm giá theo phần trăm'}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Số lượng:</span>
                              <div className={`px-2 py-1 rounded text-xs text-white ${getQuantityBadgeColor(voucher.quantity)}`}>
                                {voucher.quantity} khả dụng
                              </div>
                            </div>
                            <span className={`text-sm ${voucher.quantity === 0 ? 'text-gray-500' : voucher.quantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                              {getQuantityLabel(voucher.quantity)}
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
                                onClick={() => setDeletingVoucherCode(voucher.code)}
                              >
                                <Trash2 className="size-4" />
                                Xóa
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xóa phiếu "{voucher.code}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn phiếu giảm giá "{voucher.code}" với {formatDiscount(voucher)} khỏi kho của bạn.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletingVoucherCode(null)}>
                                  Hủy
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(voucher.code)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Xóa phiếu
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