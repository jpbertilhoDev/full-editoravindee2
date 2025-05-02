"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, CreditCard, Truck, 
  MapPin, CheckCircle, ShieldCheck, LockClosed,
  Info, Edit, Trash
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';

// Step 1: Shipping information
interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressComplement: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveInfo: boolean;
}

// Step 2: Payment information
interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  savePaymentInfo: boolean;
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
}

// Steps for the checkout process
type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

export default function CheckoutClient() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState<CheckoutStep>('shipping');
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    addressComplement: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'BR',
    saveInfo: true,
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentFormData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false,
    paymentMethod: 'credit-card',
  });

  // Shipping options
  const shippingOptions = [
    { id: 'standard', name: 'Padrão (3-5 dias úteis)', price: 0, description: 'Entrega gratuita para compras acima de R$35' },
    { id: 'express', name: 'Expressa (1-2 dias úteis)', price: 15.99, description: 'Entregamos em até 48 horas' },
    { id: 'same-day', name: 'Mesmo Dia (Hoje)', price: 29.99, description: 'Válido apenas para pedidos até 14h' },
  ];

  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Handle shipping form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setShippingInfo({
      ...shippingInfo,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Handle payment form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setPaymentInfo({
        ...paymentInfo,
        [name]: formattedValue,
      });
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(.{2})(.*)$/, '$1/$2')
        .slice(0, 5);
      
      setPaymentInfo({
        ...paymentInfo,
        [name]: formattedValue,
      });
      return;
    }
    
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? e.target.checked : value,
    });
  };

  // Handle payment method change
  const handlePaymentMethodChange = (value: 'credit-card' | 'paypal' | 'bank-transfer') => {
    setPaymentInfo({
      ...paymentInfo,
      paymentMethod: value,
    });
  };

  // Handle shipping option change
  const handleShippingOptionChange = (value: string) => {
    setSelectedShipping(value);
  };

  // Navigate to next step
  const handleNextStep = () => {
    if (activeStep === 'shipping') {
      setActiveStep('payment');
    } else if (activeStep === 'payment') {
      setActiveStep('review');
    } else if (activeStep === 'review') {
      handlePlaceOrder();
    }
  };

  // Navigate to previous step
  const handlePreviousStep = () => {
    if (activeStep === 'payment') {
      setActiveStep('shipping');
    } else if (activeStep === 'review') {
      setActiveStep('payment');
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setActiveStep('confirmation');
      clearCart();
      setIsLoading(false);
    }, 2000);
  };

  // Calculate order summary
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
  const shippingCost = selectedShippingOption ? selectedShippingOption.price : 0;
  const subtotal = total;
  const taxes = subtotal * 0.08; // 8% tax
  const orderTotal = subtotal + shippingCost + taxes;

  // Check if forms are complete
  const isShippingFormComplete = 
    shippingInfo.firstName && 
    shippingInfo.lastName && 
    shippingInfo.email && 
    shippingInfo.phone && 
    shippingInfo.address && 
    shippingInfo.city && 
    shippingInfo.state && 
    shippingInfo.zipCode;

  const isPaymentFormComplete = 
    paymentInfo.paymentMethod === 'credit-card' 
      ? (paymentInfo.cardholderName && 
         paymentInfo.cardNumber && 
         paymentInfo.expiryDate && 
         paymentInfo.cvv)
      : true;

  if (items.length === 0 && activeStep !== 'confirmation') {
    return null; // Will redirect to cart
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Logo e Etapas */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-[#26a69a]">GRACE</h1>
          </Link>
          
          {activeStep !== 'confirmation' && (
            <div className="flex justify-center items-center mb-8">
              <div className={`flex flex-col items-center space-y-1 ${activeStep === 'shipping' ? 'text-[#26a69a]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'shipping' ? 'bg-[#26a69a] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="text-xs">Endereço</span>
              </div>
              
              <div className={`w-16 h-0.5 ${activeStep === 'shipping' ? 'bg-gray-200' : 'bg-[#26a69a]'}`}></div>
              
              <div className={`flex flex-col items-center space-y-1 ${activeStep === 'payment' ? 'text-[#26a69a]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'payment' ? 'bg-[#26a69a] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="text-xs">Pagamento</span>
              </div>
              
              <div className={`w-16 h-0.5 ${activeStep === 'review' ? 'bg-[#26a69a]' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center space-y-1 ${activeStep === 'review' ? 'text-[#26a69a]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'review' ? 'bg-[#26a69a] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className="text-xs">Revisão</span>
              </div>
            </div>
          )}
        </div>
        
        {activeStep === 'confirmation' ? (
          <OrderConfirmation shippingInfo={shippingInfo} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário Principal */}
            <div className="lg:col-span-2">
              {activeStep === 'shipping' && <ShippingForm shippingInfo={shippingInfo} handleChange={handleShippingChange} shippingOptions={shippingOptions} selectedShipping={selectedShipping} handleShippingOptionChange={handleShippingOptionChange} />}
              
              {activeStep === 'payment' && <PaymentForm paymentInfo={paymentInfo} handleChange={handlePaymentChange} handlePaymentMethodChange={handlePaymentMethodChange} />}
              
              {activeStep === 'review' && <OrderReview shippingInfo={shippingInfo} paymentInfo={paymentInfo} selectedShippingOption={selectedShippingOption} setActiveStep={setActiveStep} />}
              
              <div className="flex justify-between mt-8">
                {activeStep !== 'shipping' && (
                  <Button 
                    variant="outline" 
                    className="flex items-center" 
                    onClick={handlePreviousStep}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                )}
                {activeStep === 'shipping' && (
                  <Link href="/cart">
                    <Button 
                      variant="outline" 
                      className="flex items-center" 
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Voltar ao Carrinho
                    </Button>
                  </Link>
                )}
                
                <Button 
                  className="bg-[#26a69a] hover:bg-[#2bbbad] text-white ml-auto flex items-center"
                  onClick={handleNextStep}
                  disabled={(activeStep === 'shipping' && !isShippingFormComplete) || 
                           (activeStep === 'payment' && !isPaymentFormComplete) ||
                           isLoading}
                >
                  {isLoading ? (
                    <>Processando...</>
                  ) : (
                    <>
                      {activeStep === 'review' ? 'Finalizar Pedido' : 'Continuar'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <OrderSummary 
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                taxes={taxes}
                total={orderTotal}
              />
              
              <div className="bg-white rounded-lg p-4 mt-4 shadow-sm border border-gray-100">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <ShieldCheck className="h-4 w-4 mr-2 text-[#26a69a]" />
                  <span>Pagamento seguro</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-[#26a69a]" />
                  <span>Entrega rápida e rastreável</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 