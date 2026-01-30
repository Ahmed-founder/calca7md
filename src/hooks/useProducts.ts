import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PricingResult, ProductInput } from '@/lib/pricing';

interface SaveProductParams {
  input: ProductInput;
  result: PricingResult;
}

export const useProducts = () => {
  const queryClient = useQueryClient();

  // Fetch all products
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Save a product
  const saveProduct = useMutation({
    mutationFn: async ({ input, result }: SaveProductParams) => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: input.name,
          link: input.link || null,
          image_url: input.imageUrl || null,
          total_cost: result.totalMerchantCost,
          selling_price: result.sellingPrice,
          net_profit: result.netProfit,
          margin_type: result.marginType,
          base_cost: input.baseCost || 0,
          import_shipping: input.importShipping || 0,
          packaging_cost: input.packagingCost || 0,
          customs_clearance: input.customsClearance || 0,
          misc_costs: input.miscCosts || 0,
          customer_delivery_fee: input.customerDeliveryFee || 0,
          gateway_fee_percent: input.gatewayFeePercent || 2.2,
          gateway_fixed_fee: input.gatewayFixedFee || 1.0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { input, result }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product saved!', {
        description: `"${input.name}" saved with ${result.marginLabel} strategy`,
      });
    },
    onError: (error) => {
      toast.error('Failed to save product', {
        description: error.message,
      });
    },
  });

  // Delete a product
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted', {
        description: 'The pricing scenario has been removed',
      });
    },
    onError: (error) => {
      toast.error('Failed to delete product', {
        description: error.message,
      });
    },
  });

  return {
    products,
    isLoading,
    error,
    saveProduct,
    deleteProduct,
  };
};
