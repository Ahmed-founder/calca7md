import { motion } from 'framer-motion';
import { Bookmark, TrendingUp, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingResult, formatCurrency } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  result: PricingResult;
  productName: string;
  onSave: (result: PricingResult) => void;
  isLoading?: boolean;
  index: number;
}

const getCardStyles = (type: 'aggressive' | 'recommended' | 'premium') => {
  switch (type) {
    case 'aggressive':
      return {
        gradient: 'from-warning/20 to-warning/5',
        border: 'border-warning/30 hover:border-warning/50',
        icon: Zap,
        iconColor: 'text-warning',
        badge: 'bg-warning/20 text-warning',
      };
    case 'recommended':
      return {
        gradient: 'from-primary/20 to-primary/5',
        border: 'border-primary/30 hover:border-primary/50',
        icon: TrendingUp,
        iconColor: 'text-primary',
        badge: 'bg-primary/20 text-primary',
      };
    case 'premium':
      return {
        gradient: 'from-premium/20 to-premium/5',
        border: 'border-premium/30 hover:border-premium/50',
        icon: Crown,
        iconColor: 'text-premium',
        badge: 'bg-premium/20 text-premium',
      };
  }
};

export const PricingCard = ({ result, productName, onSave, isLoading, index }: PricingCardProps) => {
  const styles = getCardStyles(result.marginType);
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300',
        'bg-gradient-to-br',
        styles.gradient,
        styles.border
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', styles.badge)}>
              {result.margin}% Margin
            </span>
            <Icon className={cn('w-5 h-5', styles.iconColor)} />
          </div>
          <CardTitle className="text-lg font-semibold mt-2">{result.marginLabel}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {result.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground text-sm">Selling Price</span>
              <span className="text-2xl font-bold font-mono">{formatCurrency(result.sellingPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Total Cost</span>
              <span className="font-mono text-sm">{formatCurrency(result.totalMerchantCost)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Gateway Fee</span>
              <span className="font-mono text-sm text-destructive">-{formatCurrency(result.gatewayFee)}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <span className="text-muted-foreground text-sm font-medium">Net Profit</span>
              <span className={cn(
                'font-mono font-bold text-lg',
                result.netProfit > 0 ? 'text-success' : 'text-destructive'
              )}>
                {formatCurrency(result.netProfit)}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="secondary" 
            className="w-full gap-2"
            onClick={() => onSave(result)}
            disabled={isLoading || !productName}
          >
            <Bookmark className="w-4 h-4" />
            Save to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
