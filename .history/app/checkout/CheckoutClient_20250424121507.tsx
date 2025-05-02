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
} 