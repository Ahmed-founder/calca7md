import { z } from 'zod';

// Zod schema for product inputs - all numbers optional
export const productInputSchema = z.object({
  // Product Info
  name: z.string().min(1, 'Product name is required'),
  link: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  
  // Merchant Costs
  baseCost: z.coerce.number().min(0).optional().default(0),
  importShipping: z.coerce.number().min(0).optional().default(0),
  packagingCost: z.coerce.number().min(0).optional().default(0),
  customsClearance: z.coerce.number().min(0).optional().default(0),
  miscCosts: z.coerce.number().min(0).optional().default(0),
  
  // Sales Variables
  customerDeliveryFee: z.coerce.number().min(0).optional().default(0),
  gatewayFeePercent: z.coerce.number().min(0).max(100).optional().default(2.2),
  gatewayFixedFee: z.coerce.number().min(0).optional().default(1.0),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export interface PricingResult {
  sellingPrice: number;
  netProfit: number;
  margin: number;
  gatewayFee: number;
  totalMerchantCost: number;
  marginType: 'aggressive' | 'recommended' | 'premium';
  marginLabel: string;
  description: string;
}

// Default input values
export const defaultProductInput: ProductInput = {
  name: '',
  link: '',
  imageUrl: '',
  baseCost: 0,
  importShipping: 0,
  packagingCost: 0,
  customsClearance: 0,
  miscCosts: 0,
  customerDeliveryFee: 25,
  gatewayFeePercent: 2.2,
  gatewayFixedFee: 1.0,
};

// Helper to safely get number value, defaulting to 0
const toNumber = (value: number | undefined | null): number => {
  if (value === undefined || value === null || isNaN(value)) return 0;
  return value;
};

// Calculate gateway fee for a given selling price
const calculateGatewayFee = (
  sellingPrice: number,
  customerDeliveryFee: number,
  gatewayFeePercent: number,
  gatewayFixedFee: number
): number => {
  const totalTransactionValue = sellingPrice + customerDeliveryFee;
  return (totalTransactionValue * (gatewayFeePercent / 100)) + gatewayFixedFee;
};

// Calculate selling price for a target margin
const calculateSellingPriceForMargin = (
  totalMerchantCost: number,
  targetMargin: number,
  customerDeliveryFee: number,
  gatewayFeePercent: number,
  gatewayFixedFee: number
): number => {
  // We need to solve for selling price where:
  // netProfit = sellingPrice - totalMerchantCost - gatewayFee
  // margin = netProfit / sellingPrice
  // 
  // Substituting:
  // margin * sellingPrice = sellingPrice - totalMerchantCost - ((sellingPrice + deliveryFee) * gatewayPercent/100 + fixedFee)
  // margin * S = S - C - (S * g + D * g + F) where g = gatewayPercent/100
  // margin * S = S - C - S*g - D*g - F
  // margin * S = S(1 - g) - C - D*g - F
  // S * (margin - 1 + g) = -C - D*g - F
  // S = (C + D*g + F) / (1 - g - margin)
  
  const g = gatewayFeePercent / 100;
  const denominator = 1 - g - targetMargin;
  
  if (denominator <= 0) {
    // If the math doesn't work (margin too high), return a safe estimate
    return totalMerchantCost * (1 / (1 - targetMargin));
  }
  
  const sellingPrice = (totalMerchantCost + customerDeliveryFee * g + gatewayFixedFee) / denominator;
  
  return Math.max(sellingPrice, totalMerchantCost); // Never sell below cost
};

// Main calculation function
export const calculatePricing = (input: Partial<ProductInput>): PricingResult[] => {
  // Safely convert all inputs to numbers
  const baseCost = toNumber(input.baseCost);
  const importShipping = toNumber(input.importShipping);
  const packagingCost = toNumber(input.packagingCost);
  const customsClearance = toNumber(input.customsClearance);
  const miscCosts = toNumber(input.miscCosts);
  const customerDeliveryFee = toNumber(input.customerDeliveryFee);
  const gatewayFeePercent = toNumber(input.gatewayFeePercent) || 2.2;
  const gatewayFixedFee = toNumber(input.gatewayFixedFee) || 1.0;
  
  // Calculate total merchant cost
  const totalMerchantCost = baseCost + importShipping + packagingCost + customsClearance + miscCosts;
  
  // Define target margins for each strategy
  const strategies: { margin: number; type: 'aggressive' | 'recommended' | 'premium'; label: string; description: string }[] = [
    { 
      margin: 0.20, 
      type: 'aggressive', 
      label: 'Aggressive (Launch)',
      description: 'Low margin for market entry & volume growth'
    },
    { 
      margin: 0.35, 
      type: 'recommended', 
      label: 'Recommended (Growth)',
      description: 'Balanced margin for sustainable growth'
    },
    { 
      margin: 0.50, 
      type: 'premium', 
      label: 'Premium (Brand)',
      description: 'High margin for brand positioning'
    },
  ];
  
  return strategies.map(strategy => {
    const sellingPrice = calculateSellingPriceForMargin(
      totalMerchantCost,
      strategy.margin,
      customerDeliveryFee,
      gatewayFeePercent,
      gatewayFixedFee
    );
    
    const gatewayFee = calculateGatewayFee(
      sellingPrice,
      customerDeliveryFee,
      gatewayFeePercent,
      gatewayFixedFee
    );
    
    const netProfit = sellingPrice - totalMerchantCost - gatewayFee;
    const actualMargin = sellingPrice > 0 ? netProfit / sellingPrice : 0;
    
    return {
      sellingPrice: Math.round(sellingPrice * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      margin: Math.round(actualMargin * 100),
      gatewayFee: Math.round(gatewayFee * 100) / 100,
      totalMerchantCost: Math.round(totalMerchantCost * 100) / 100,
      marginType: strategy.type,
      marginLabel: strategy.label,
      description: strategy.description,
    };
  });
};

// Format currency (SAR)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
  }).format(value);
};
