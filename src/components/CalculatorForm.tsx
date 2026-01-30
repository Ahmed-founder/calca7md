import { UseFormReturn } from 'react-hook-form';
import { Package, DollarSign, Truck, CreditCard, Link, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductInput } from '@/lib/pricing';

interface CalculatorFormProps {
  form: UseFormReturn<ProductInput>;
}

export const CalculatorForm = ({ form }: CalculatorFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Product Info</CardTitle>
          </div>
          <CardDescription>Basic product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Wireless Earbuds Pro"
              {...register('name')}
              className="bg-background/50"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm font-medium flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" />
                Product Link
              </Label>
              <Input
                id="link"
                type="url"
                placeholder="https://salla.sa/..."
                {...register('link')}
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-sm font-medium flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5" />
                Image URL
              </Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://..."
                {...register('imageUrl')}
                className="bg-background/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merchant Costs */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Merchant Costs</CardTitle>
          </div>
          <CardDescription>Your expenses and product costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseCost" className="text-sm font-medium">
                Base Cost (SAR)
              </Label>
              <Input
                id="baseCost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('baseCost')}
                className="bg-background/50 font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="importShipping" className="text-sm font-medium">
                Import Shipping (SAR)
              </Label>
              <Input
                id="importShipping"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('importShipping')}
                className="bg-background/50 font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="packagingCost" className="text-sm font-medium">
                Packaging Cost (SAR)
              </Label>
              <Input
                id="packagingCost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('packagingCost')}
                className="bg-background/50 font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customsClearance" className="text-sm font-medium">
                Customs & Clearance (SAR)
              </Label>
              <Input
                id="customsClearance"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('customsClearance')}
                className="bg-background/50 font-mono"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="miscCosts" className="text-sm font-medium">
                Misc/Extra Costs (SAR)
              </Label>
              <Input
                id="miscCosts"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('miscCosts')}
                className="bg-background/50 font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Variables */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Sales Variables</CardTitle>
          </div>
          <CardDescription>Delivery and payment gateway settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerDeliveryFee" className="text-sm font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Customer Delivery Fee (SAR)
            </Label>
            <Input
              id="customerDeliveryFee"
              type="number"
              step="0.01"
              min="0"
              placeholder="25.00"
              {...register('customerDeliveryFee')}
              className="bg-background/50 font-mono"
            />
            <p className="text-xs text-muted-foreground">Amount customer pays for delivery</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gatewayFeePercent" className="text-sm font-medium">
                Gateway Fee (%)
              </Label>
              <Input
                id="gatewayFeePercent"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="2.2"
                {...register('gatewayFeePercent')}
                className="bg-background/50 font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gatewayFixedFee" className="text-sm font-medium">
                Gateway Fixed Fee (SAR)
              </Label>
              <Input
                id="gatewayFixedFee"
                type="number"
                step="0.01"
                min="0"
                placeholder="1.00"
                {...register('gatewayFixedFee')}
                className="bg-background/50 font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
