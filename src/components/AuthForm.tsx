import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type AuthFormData = z.infer<typeof authSchema>;

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (data: AuthFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast.error('فشل تسجيل الدخول', {
        description: error.message,
      });
    } else {
      toast.success('تم تسجيل الدخول بنجاح!');
    }
  };

  const handleSignUp = async (data: AuthFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password);
    setIsLoading(false);

    if (error) {
      toast.error('فشل إنشاء الحساب', {
        description: error.message,
      });
    } else {
      toast.success('تم إنشاء الحساب!', {
        description: 'تحقق من بريدك الإلكتروني لتأكيد الحساب',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">مدير التسعير الذكي</CardTitle>
          <CardDescription>سجل الدخول للوصول إلى حاسبة التسعير</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="gap-2">
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger value="signup" className="gap-2">
                <UserPlus className="w-4 h-4" />
                حساب جديد
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              className="pr-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pr-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    ) : (
                      <LogIn className="w-4 h-4 ml-2" />
                    )}
                    تسجيل الدخول
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              className="pr-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pr-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 ml-2" />
                    )}
                    إنشاء حساب
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
