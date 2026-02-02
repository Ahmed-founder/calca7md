import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PricingResult, ProductInput } from '@/lib/pricing';
import { useAuth } from '@/hooks/useAuth';

interface SaveProductParams {
  input: ProductInput;
  result: PricingResult;
}

export const useProducts = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all products for the current user
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Save a product
  const saveProduct = useMutation({
    mutationFn: async ({ input, result }: SaveProductParams) => {
      if (!user) throw new Error('يجب تسجيل الدخول لحفظ المنتجات');
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
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
      queryClient.invalidateQueries({ queryKey: ['products', user?.id] });
      toast.success('تم حفظ المنتج!', {
        description: `"${input.name}" تم حفظه باستراتيجية ${result.marginLabel}`,
      });
    },
    onError: (error) => {
      toast.error('فشل حفظ المنتج', {
        description: error.message,
      });
    },
  });

  // Delete a product
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('يجب تسجيل الدخول لحذف المنتجات');
      
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', user?.id] });
      toast.success('تم حذف المنتج', {
        description: 'تم إزالة سيناريو التسعير',
      });
    },
    onError: (error) => {
      toast.error('فشل حذف المنتج', {
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
