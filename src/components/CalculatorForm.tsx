import { UseFormReturn } from 'react-hook-form';
import { Package, DollarSign, Truck, CreditCard, Link, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductInput, parseNumberInput } from '@/lib/pricing';

interface CalculatorFormProps {
  form: UseFormReturn<ProductInput>;
}

export const CalculatorForm = ({ form }: CalculatorFormProps) => {
  const { register, formState: { errors }, setValue, watch } = form;

  // Custom handler for number inputs
  const handleNumberChange = (field: keyof ProductInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or numeric input
    if (value === '' || /^[\d٠-٩.,]*$/.test(value)) {
      const numValue = parseNumberInput(value);
      setValue(field, numValue as any, { shouldValidate: true });
    }
  };

  const getDisplayValue = (field: keyof ProductInput) => {
    const value = watch(field);
    if (value === 0 || value === undefined || value === null) return '';
    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* معلومات المنتج */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">معلومات المنتج</CardTitle>
          </div>
          <CardDescription>البيانات الأساسية للمنتج</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              اسم المنتج <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="مثال: سماعات لاسلكية"
              {...register('name')}
              className="bg-background/50"
            />
            {errors.name && (
              <p className="text-xs text-destructive">اسم المنتج مطلوب</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm font-medium flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" />
                رابط المنتج
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://salla.sa/..."
                {...register('link')}
                className="bg-background/50"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-sm font-medium flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                رابط الصورة
              </Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://..."
                {...register('imageUrl')}
                className="bg-background/50"
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تكاليف التاجر */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">تكاليف التاجر</CardTitle>
          </div>
          <CardDescription>مصاريفك وتكاليف المنتج</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseCost" className="text-sm font-medium">
                سعر الشراء (ر.س)
              </Label>
              <Input
                id="baseCost"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={getDisplayValue('baseCost')}
                onChange={handleNumberChange('baseCost')}
                className="bg-background/50 font-mono"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="importShipping" className="text-sm font-medium">
                شحن الاستيراد (ر.س)
              </Label>
              <Input
                id="importShipping"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={getDisplayValue('importShipping')}
                onChange={handleNumberChange('importShipping')}
                className="bg-background/50 font-mono"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="packagingCost" className="text-sm font-medium">
                تكلفة التغليف (ر.س)
              </Label>
              <Input
                id="packagingCost"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={getDisplayValue('packagingCost')}
                onChange={handleNumberChange('packagingCost')}
                className="bg-background/50 font-mono"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customsClearance" className="text-sm font-medium">
                الجمارك والتخليص (ر.س)
              </Label>
              <Input
                id="customsClearance"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={getDisplayValue('customsClearance')}
                onChange={handleNumberChange('customsClearance')}
                className="bg-background/50 font-mono"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="miscCosts" className="text-sm font-medium">
                تكاليف إضافية (ر.س)
              </Label>
              <Input
                id="miscCosts"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={getDisplayValue('miscCosts')}
                onChange={handleNumberChange('miscCosts')}
                className="bg-background/50 font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* متغيرات البيع */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">متغيرات البيع</CardTitle>
          </div>
          <CardDescription>إعدادات التوصيل وبوابة الدفع</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerDeliveryFee" className="text-sm font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              رسوم توصيل العميل (ر.س)
            </Label>
            <Input
              id="customerDeliveryFee"
              type="text"
              inputMode="numeric"
              placeholder="25"
              value={getDisplayValue('customerDeliveryFee')}
              onChange={handleNumberChange('customerDeliveryFee')}
              className="bg-background/50 font-mono"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">المبلغ الذي يدفعه العميل للتوصيل</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gatewayFeePercent" className="text-sm font-medium">
                رسوم البوابة (%)
              </Label>
              <Input
                id="gatewayFeePercent"
                type="text"
                inputMode="decimal"
                placeholder="2.2"
                value={getDisplayValue('gatewayFeePercent')}
                onChange={handleNumberChange('gatewayFeePercent')}
                className="bg-background/50 font-mono"
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gatewayFixedFee" className="text-sm font-medium">
                الرسوم الثابتة (ر.س)
              </Label>
              <Input
                id="gatewayFixedFee"
                type="text"
                inputMode="decimal"
                placeholder="1"
                value={getDisplayValue('gatewayFixedFee')}
                onChange={handleNumberChange('gatewayFixedFee')}
                className="bg-background/50 font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
