import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoucherInventory } from '../components/VoucherInventory';
import { VoucherAdd } from '../components/VoucherAdd';
import { VoucherEdit } from '../components/VoucherEdit';
import { VoucherDelete } from '../components/VoucherDelete';
import { toast } from 'sonner@2.0.3';

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

interface VouchersProps {
  vouchers: Voucher[];
  refreshVouchers: () => Promise<void>;
  onAddVoucher: (voucher: any) => Promise<void>;
  onSaveVoucher: (voucher: Voucher) => Promise<void>;
  onDeleteVoucher: (voucherCode: string) => Promise<void>;
}

export function Vouchers({ vouchers, refreshVouchers, onAddVoucher, onSaveVoucher, onDeleteVoucher }: VouchersProps) {
  const navigate = useNavigate();
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(null);
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [showDeleteVoucher, setShowDeleteVoucher] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Load vouchers when component mounts (only once)
  useEffect(() => {
    if (hasLoadedRef.current) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshVouchers();
        hasLoadedRef.current = true;
      } catch (err: any) {
        toast.error(err.message || 'Không thể tải dữ liệu voucher');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshVouchers]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-[1440px] h-[1343px] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show add voucher page
  if (showAddVoucher) {
    return (
      <VoucherAdd 
        onBack={() => setShowAddVoucher(false)}
        onAdd={async (voucher) => {
          try {
            await onAddVoucher(voucher);
            toast.success('Đã thêm voucher thành công!');
            setShowAddVoucher(false);
          } catch (err: any) {
            toast.error(err.message || 'Không thể thêm voucher');
          }
        }}
      />
    );
  }

  // Show voucher edit page
  if (selectedVoucherCode !== null) {
    const selectedVoucher = vouchers.find(voucher => voucher.code === selectedVoucherCode);
    if (selectedVoucher) {
      return (
        <VoucherEdit 
          voucher={selectedVoucher} 
          onBack={() => setSelectedVoucherCode(null)}
          onSave={async (voucher) => {
            try {
              await onSaveVoucher(voucher);
              toast.success('Đã cập nhật voucher thành công!');
              setSelectedVoucherCode(null);
            } catch (err: any) {
              toast.error(err.message || 'Không thể cập nhật voucher');
            }
          }}
          onDelete={async (voucherCode) => {
            try {
              const voucherToDelete = vouchers.find(v => v.code === voucherCode);
              await onDeleteVoucher(voucherCode);
              toast.success(`Voucher "${voucherToDelete?.code}" đã được xóa`);
              setSelectedVoucherCode(null);
            } catch (err: any) {
              toast.error(err.message || 'Không thể xóa voucher');
            }
          }}
        />
      );
    }
  }

  // Show delete voucher page
  if (showDeleteVoucher) {
    return (
      <VoucherDelete 
        vouchers={vouchers}
        onBack={() => setShowDeleteVoucher(false)}
        onDelete={async (voucherCode) => {
          try {
            const voucherToDelete = vouchers.find(v => v.code === voucherCode);
            await onDeleteVoucher(voucherCode);
            toast.success(`Voucher "${voucherToDelete?.code}" đã được xóa`);
          } catch (err: any) {
            toast.error(err.message || 'Không thể xóa voucher');
          }
        }}
      />
    );
  }

  // Show voucher inventory
  return (
    <VoucherInventory 
      vouchers={vouchers} 
      onBack={() => navigate('/')}
      onAddVoucher={() => setShowAddVoucher(true)}
      onDeleteVoucher={() => setShowDeleteVoucher(true)}
      onVoucherClick={(voucherCode) => setSelectedVoucherCode(voucherCode)}
    />
  );
}