import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Calculator, LayoutDashboard, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorForm } from '@/components/CalculatorForm';
import { PricingCard } from '@/components/PricingCard';
import { ProductsTable } from '@/components/ProductsTable';
import { productInputSchema, ProductInput, defaultProductInput, calculatePricing, PricingResult } from '@/lib/pricing';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const form = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: defaultProductInput,
    mode: 'onChange',
  });

  const { products, isLoading, saveProduct, deleteProduct } = useProducts();

  // Watch all form values for real-time calculation
  const watchedValues = form.watch();

  // Calculate pricing in real-time
  const pricingResults = useMemo(() => {
    return calculatePricing(watchedValues);
  }, [watchedValues]);

  const handleSaveProduct = (result: PricingResult) => {
    const values = form.getValues();
    saveProduct.mutate({ input: values, result });
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct.mutate(id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Smart Pricing Manager</h1>
              <p className="text-sm text-muted-foreground">Salla Store Pricing Calculator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 lg:py-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary/50">
            <TabsTrigger value="calculator" className="gap-2">
              <Calculator className="w-4 h-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
              {products.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                  {products.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Form Section */}
              <div>
                <CalculatorForm form={form} />
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                  <h2 className="text-lg font-semibold">Pricing Strategies</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {pricingResults.map((result, index) => (
                    <PricingCard
                      key={result.marginType}
                      result={result}
                      productName={watchedValues.name || ''}
                      onSave={handleSaveProduct}
                      isLoading={saveProduct.isPending}
                      index={index}
                    />
                  ))}
                </div>

                {!watchedValues.name && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Enter a product name to enable saving
                  </p>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="dashboard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProductsTable
                products={products}
                onDelete={handleDeleteProduct}
                isLoading={isLoading || deleteProduct.isPending}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
