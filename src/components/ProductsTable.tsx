import { motion } from 'framer-motion';
import { Copy, Trash2, ExternalLink, Zap, TrendingUp, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/pricing';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  created_at: string;
  name: string;
  link: string | null;
  total_cost: number;
  selling_price: number;
  net_profit: number;
  margin_type: string;
}

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const getMarginIcon = (type: string) => {
  switch (type) {
    case 'aggressive':
      return <Zap className="w-3.5 h-3.5" />;
    case 'recommended':
      return <TrendingUp className="w-3.5 h-3.5" />;
    case 'premium':
      return <Crown className="w-3.5 h-3.5" />;
    default:
      return null;
  }
};

const getMarginStyles = (type: string) => {
  switch (type) {
    case 'aggressive':
      return 'bg-warning/20 text-warning border-warning/30';
    case 'recommended':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'premium':
      return 'bg-premium/20 text-premium border-premium/30';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

export const ProductsTable = ({ products, onDelete, isLoading }: ProductsTableProps) => {
  const copyPrice = (price: number, productName: string) => {
    navigator.clipboard.writeText(price.toString());
    toast.success(`Price copied!`, {
      description: `${formatCurrency(price)} for "${productName}" copied to clipboard`,
    });
  };

  if (products.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products saved yet</h3>
          <p className="text-muted-foreground text-sm text-center max-w-sm">
            Use the calculator to generate pricing scenarios and save them to your dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Saved Products</CardTitle>
        <CardDescription>{products.length} pricing scenario{products.length !== 1 ? 's' : ''} saved</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Strategy</TableHead>
                <TableHead className="text-muted-foreground text-right">Total Cost</TableHead>
                <TableHead className="text-muted-foreground text-right">Price</TableHead>
                <TableHead className="text-muted-foreground text-right">Net Profit</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="max-w-[200px] truncate">{product.name}</span>
                      {product.link && (
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn('gap-1 capitalize', getMarginStyles(product.margin_type))}
                    >
                      {getMarginIcon(product.margin_type)}
                      {product.margin_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatCurrency(product.total_cost)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium">
                    {formatCurrency(product.selling_price)}
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-mono text-sm font-medium',
                    product.net_profit > 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {formatCurrency(product.net_profit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => copyPrice(product.selling_price, product.name)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(product.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
