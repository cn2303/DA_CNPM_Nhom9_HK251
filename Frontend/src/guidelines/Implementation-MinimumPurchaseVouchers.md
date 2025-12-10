# Minimum Purchase Condition for Vouchers - Implementation Documentation

## Date: October 23, 2025

## Overview
Added a minimum purchase condition attribute to the voucher system, allowing admins to set a bare minimum order value required for customers to apply a specific voucher.

## Feature Description
- Vouchers can now have a minimum purchase requirement (in Vietnamese Đồng)
- If set to 0, there is no minimum condition
- The minimum purchase amount is displayed in the voucher inventory
- Admins can set and edit this value when creating or editing vouchers
- Real-time formatting shows the condition in Vietnamese currency format

## Files Modified

### 1. `/App.tsx`
**Changes:**
- Updated `Voucher` interface to include `minPurchase: number` field
- Added `minPurchase` values to sample voucher data:
  - SUMMER25: 100,000₫ minimum
  - SAVE10: 50,000₫ minimum
  - WELCOME15: 0₫ (no minimum)

**Interface Definition:**
```typescript
interface Voucher {
  id: number;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  quantity: number;
  logo: string;
  minPurchase: number; // NEW FIELD
}
```

### 2. `/components/VoucherAdd.tsx`
**Changes:**
- Added `minPurchase` field to voucher state (default: 0)
- Added input field for "Giá trị đơn hàng tối thiểu" (Minimum Order Value)
- Implemented `formatCurrency()` helper function for Vietnamese Đồng formatting
- Added real-time display showing:
  - If > 0: "Phiếu chỉ áp dụng cho đơn hàng từ [amount]₫"
  - If = 0: "Không có điều kiện tối thiểu"

**New Input Field:**
```typescript
<div className="space-y-3">
  <Label htmlFor="minPurchase" className="text-lg">Giá trị đơn hàng tối thiểu</Label>
  <Input
    id="minPurchase"
    type="number"
    min="0"
    value={newVoucher.minPurchase}
    onChange={(e) => setNewVoucher({ ...newVoucher, minPurchase: parseFloat(e.target.value) || 0 })}
    placeholder="0"
    className="h-12"
  />
  <p className="text-sm text-muted-foreground">
    {newVoucher.minPurchase > 0 
      ? `Phiếu chỉ áp dụng cho đơn hàng từ ${formatCurrency(newVoucher.minPurchase)}`
      : 'Không có điều kiện tối thiểu'}
  </p>
</div>
```

### 3. `/components/VoucherEdit.tsx`
**Changes:**
- Updated to support `minPurchase` field in edited voucher state
- Added same input field as VoucherAdd for editing minimum purchase
- Implemented `formatCurrency()` helper function
- Added real-time condition display

**Functionality:**
- Preserves existing minimum purchase value when editing
- Allows admins to update the minimum purchase requirement
- Shows formatted condition message in Vietnamese

### 4. `/components/VoucherInventory.tsx`
**Changes:**
- Updated interface to include `minPurchase: number`
- Added display of minimum purchase condition in voucher cards
- Implemented `formatCurrency()` helper function
- Added new row in voucher details section

**Display Logic:**
```typescript
<div className="flex items-center justify-between">
  <span className="text-muted-foreground">Đơn tối thiểu</span>
  <span className="font-medium">
    {voucher.minPurchase > 0 ? formatCurrency(voucher.minPurchase) : 'Không'}
  </span>
</div>
```

### 5. `/components/OrderDetail.tsx`
**Changes (Previous Implementation):**
- Translated to Vietnamese
- Updated currency display to Vietnamese Đồng format
- Note: This was part of a separate translation update

## Currency Formatting

### Helper Function (Used in all voucher components)
```typescript
const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('vi-VN')}₫`;
};
```

### Examples:
- 0 → "Không" (None)
- 50000 → "50,000₫"
- 100000 → "100,000₫"
- 1000000 → "1,000,000₫"

## User Interface

### VoucherInventory Display
Each voucher card now shows:
```
┌─────────────────────────────┐
│  [Voucher Logo Image]       │
│                              │
│  SUMMER25    [25% GIẢM]     │
│  ─────────────────────────   │
│  Khả dụng      100 phiếu    │
│  Đơn tối thiểu  100,000₫    │ ← NEW ROW
└─────────────────────────────┘
```

### VoucherAdd/Edit Form
Form layout includes (in order):
1. Logo URL
2. Mã phiếu (Voucher Code)
3. Loại giảm giá (Discount Type)
4. Phần trăm giảm / Số tiền giảm (Discount Amount)
5. **Giá trị đơn hàng tối thiểu** (Minimum Order Value) ← NEW FIELD
   - With real-time condition display
6. Số lượng khả dụng (Available Quantity)

## Sample Data

### Current Vouchers in System:
1. **SUMMER25**
   - Discount: 25% off
   - Quantity: 100
   - Minimum Purchase: 100,000₫

2. **SAVE10**
   - Discount: 10₫ fixed
   - Quantity: 50
   - Minimum Purchase: 50,000₫

3. **WELCOME15**
   - Discount: 15% off
   - Quantity: 200
   - Minimum Purchase: 0₫ (No minimum)

## Technical Notes

### Type Safety
- All components use TypeScript interfaces with the `minPurchase: number` field
- Type checking ensures consistency across add/edit/view operations

### State Management
- Minimum purchase value is stored as a number (in Vietnamese Đồng)
- 0 represents no minimum condition
- Negative values are prevented by `min="0"` input attribute

### Validation
- Input type is `number` for proper validation
- Default value is 0 if parsing fails
- Uses `parseFloat()` to allow decimal values if needed

### Localization
- All text in Vietnamese
- Currency formatted using Vietnamese locale (`vi-VN`)
- Consistent terminology throughout the application

## Future Considerations

### Potential Enhancements:
1. **Maximum Purchase Limit**: Add a maximum purchase condition
2. **Date Range**: Add start and end dates for voucher validity
3. **Product-Specific Vouchers**: Link vouchers to specific books
4. **Usage Tracking**: Track how many times each voucher has been used
5. **Customer Tier Restrictions**: Restrict vouchers by customer type
6. **Combination Rules**: Define if vouchers can be stacked
7. **Auto-apply**: Automatically apply best voucher at checkout

### Business Logic to Implement:
1. **Validation at Checkout**: Check if order meets minimum purchase requirement
2. **Error Messages**: Display clear message when minimum not met
3. **Sorting/Filtering**: Filter vouchers by minimum purchase in admin panel
4. **Customer View**: Show available vouchers to customers based on cart value

## Testing Checklist

- [x] Create voucher with minimum purchase = 0
- [x] Create voucher with minimum purchase > 0
- [x] Edit existing voucher to change minimum purchase
- [x] Display minimum purchase in inventory grid
- [x] Currency formatting displays correctly
- [x] Real-time condition message updates when typing
- [x] Vietnamese translations are accurate
- [ ] Validate voucher application at checkout (future)
- [ ] Test with large minimum values (>1,000,000₫)
- [ ] Test edge cases (decimal values, very large numbers)

## Related Files

### Dependencies:
- `/components/ui/input.tsx` - Input component
- `/components/ui/label.tsx` - Label component
- `/components/ui/card.tsx` - Card component
- `/components/ui/button.tsx` - Button component
- `/components/ui/select.tsx` - Select component
- `/components/figma/ImageWithFallback.tsx` - Image component

### Integration Points:
- Admin Dashboard → Voucher Inventory
- Voucher Inventory → Voucher Add
- Voucher Inventory → Voucher Edit
- Order Processing (future integration)

## Code Quality

### Consistency:
- All Vietnamese translations use consistent terminology
- Currency formatting is standardized across components
- Component structure follows existing patterns
- Styling matches application design system

### Maintainability:
- Helper functions are reusable
- Clear component prop interfaces
- Descriptive variable names
- Consistent code formatting

## Version History

### Version 1.0 (October 23, 2025)
- Initial implementation of minimum purchase condition
- Added to VoucherAdd, VoucherEdit, and VoucherInventory
- Full Vietnamese localization
- Vietnamese Đồng currency formatting

---

**Implementation Status**: ✅ Complete

**Developer Notes**: This feature is ready for use. Consider implementing checkout validation logic to enforce minimum purchase requirements when customers attempt to apply vouchers.
