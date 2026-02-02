import { motion } from 'framer-motion';
import { Bookmark, TrendingUp, Crown, Zap, Flame } from 'lucide-react';
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

const getCardStyles = (type: 'aggressive' | 'recommended' | 'premium' | 'legendary') => {
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
    case 'legendary':
      return {
        gradient: 'from-orange-500/20 to-red-500/10',
        border: 'border-orange-500/30 hover:border-orange-500/50',
        icon: Flame,
        iconColor: 'text-orange-500',
        badge: 'bg-orange-500/20 text-orange-500',
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
              هامش {result.margin}%
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
              <span className="text-muted-foreground text-sm">سعر البيع</span>
              <span className="text-2xl font-bold font-mono" dir="ltr">{formatCurrency(result.sellingPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">إجمالي التكلفة</span>
              <span className="font-mono text-sm" dir="ltr">{formatCurrency(result.totalMerchantCost)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">رسوم البوابة</span>
              <span className="font-mono text-sm text-destructive" dir="ltr">-{formatCurrency(result.gatewayFee)}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <span className="text-muted-foreground text-sm font-medium">صافي الربح</span>
              <span className={cn(
                'font-mono font-bold text-lg',
                result.netProfit > 0 ? 'text-success' : 'text-destructive'
              )} dir="ltr">
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
            حفظ في لوحة التحكم
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
