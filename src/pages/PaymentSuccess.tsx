import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Truck, Clock, Package } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  order_items: Array<{
    product_name: string;
    farmer_name: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart, totalItems } = useCart();
  const navigate = useNavigate();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast({
          title: "Error",
          description: "No payment session found",
          variant: "destructive",
        });
        navigate('/cart');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error) {
          throw error;
        }

        if (data.success) {
          setOrder(data.order);
          clearCart(); // Clear cart after successful payment
          toast({
            title: "Payment Successful! 🎉",
            description: "Your order has been confirmed and farmers have been notified.",
          });
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Payment Verification Failed",
          description: "Please contact support if you were charged.",
          variant: "destructive",
        });
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={totalItems} />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verifying your payment...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={totalItems} />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Payment Verification Failed</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't verify your payment. Please contact support.
            </p>
            <Button onClick={() => navigate('/cart')}>
              Back to Cart
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={0} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for supporting our farmers directly
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order ID</p>
                  <p className="text-sm text-muted-foreground font-mono">{order.id}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{order.total_amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Order Date</p>
                  <p className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        From {item.farmer_name} • Qty: {item.quantity} {item.unit}
                      </p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-muted-foreground">
                      Farmers have been notified and will prepare your fresh produce
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Packaging & Quality Check</p>
                    <p className="text-sm text-muted-foreground">
                      Each item will be carefully packed with quality assurance
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Expected delivery within 1-2 days. You'll receive tracking information soon.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button onClick={() => {
              toast({
                title: "Order Tracking",
                description: "Order tracking will be available soon via email and SMS updates.",
              });
            }}>
              Track Order
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;