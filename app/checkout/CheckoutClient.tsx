"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, CreditCard, Truck, 
  MapPin, CheckCircle, ShieldCheck, Lock,
  Info, Edit, Trash, Loader2
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, cn } from '@/lib/utils';
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
  const { cartItems, cartTotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState<CheckoutStep>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

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

  // Prefetch routes for quicker navigation
  useEffect(() => {
    router.prefetch('/cart');
    router.prefetch('/');
    
    // Set page as loaded after small delay for nice fade-in effect
    const timer = setTimeout(() => setIsPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [router]);

  // Shipping options - memoized to prevent unnecessary re-renders
  const shippingOptions = useMemo(() => [
    { id: 'standard', name: 'Padrão (3-5 dias úteis)', price: 0, description: 'Entrega gratuita para compras acima de R$35' },
    { id: 'express', name: 'Expressa (1-2 dias úteis)', price: 15.99, description: 'Entregamos em até 48 horas' },
    { id: 'same-day', name: 'Mesmo Dia (Hoje)', price: 29.99, description: 'Válido apenas para pedidos até 14h' },
  ], []);

  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0 && activeStep !== 'confirmation') {
      router.push('/cart');
    }
  }, [cartItems, router, activeStep]);

  // Handle shipping form changes with useCallback
  const handleShippingChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setShippingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }, []);

  // Handle payment form changes with useCallback
  const handlePaymentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setPaymentInfo(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(.{2})(.*)$/, '$1/$2')
        .slice(0, 5);
      
      setPaymentInfo(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
      return;
    }
    
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  }, []);

  // Handle payment method change with useCallback
  const handlePaymentMethodChange = useCallback((value: 'credit-card' | 'paypal' | 'bank-transfer') => {
    setPaymentInfo(prev => ({
      ...prev,
      paymentMethod: value,
    }));
  }, []);

  // Handle shipping option change with useCallback
  const handleShippingOptionChange = useCallback((value: string) => {
    setSelectedShipping(value);
  }, []);

  // Navigate to next step with smooth transition
  const handleNextStep = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (activeStep === 'shipping') {
        setActiveStep('payment');
      } else if (activeStep === 'payment') {
        setActiveStep('review');
      } else if (activeStep === 'review') {
        handlePlaceOrder();
      }
      setIsTransitioning(false);
    }, 250);
  }, [activeStep]);

  // Navigate to previous step with smooth transition
  const handlePreviousStep = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (activeStep === 'payment') {
        setActiveStep('shipping');
      } else if (activeStep === 'review') {
        setActiveStep('payment');
      }
      setIsTransitioning(false);
    }, 250);
  }, [activeStep]);

  // Handle order placement
  const handlePlaceOrder = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setActiveStep('confirmation');
      clearCart();
      setIsLoading(false);
    }, 1500); // Reduzido para 1.5s para melhor experiência
  }, [clearCart]);

  // Calculate order summary with useMemo
  const orderSummary = useMemo(() => {
    const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
    const shippingCost = selectedShippingOption ? selectedShippingOption.price : 0;
    const subtotal = cartTotal;
    const taxes = subtotal * 0.08; // 8% tax
    const orderTotal = subtotal + shippingCost + taxes;

    return {
      selectedShippingOption,
      shippingCost,
      subtotal,
      taxes,
      orderTotal
    };
  }, [shippingOptions, selectedShipping, cartTotal]);

  // Check if forms are complete with useMemo
  const formValidation = useMemo(() => {
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

    return {
      isShippingFormComplete,
      isPaymentFormComplete
    };
  }, [shippingInfo, paymentInfo]);

  if (cartItems.length === 0 && activeStep !== 'confirmation') {
    return null; // Will redirect to cart
  }

  // Apply transition classes
  const containerClasses = cn(
    "min-h-screen bg-gray-50 py-8 md:py-12 transition-opacity duration-300",
    isPageLoaded ? "opacity-100" : "opacity-0"
  );

  const contentClasses = cn(
    "transition-opacity duration-300",
    isTransitioning ? "opacity-50" : "opacity-100"
  );

  return (
    <div className={containerClasses}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Logo e Etapas */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-2xl font-bold text-[#08a4a7]">GRACE</h1>
          </Link>
          
          {activeStep !== 'confirmation' && (
            <div className="flex justify-center items-center mb-8">
              <div className={`flex flex-col items-center space-y-1 ${activeStep === 'shipping' ? 'text-[#08a4a7]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'shipping' ? 'bg-[#08a4a7] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <span className="text-xs">Endereço</span>
              </div>
              
              <div className={`w-16 h-0.5 ${activeStep === 'shipping' ? 'bg-gray-200' : 'bg-[#08a4a7]'}`}></div>
              
              <div className={`flex flex-col items-center space-y-1 ${activeStep === 'payment' ? 'text-[#08a4a7]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'payment' ? 'bg-[#08a4a7] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <span className="text-xs">Pagamento</span>
              </div>
              
              <div className={`w-16 h-0.5 ${activeStep === 'review' ? 'bg-[#08a4a7]' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center space-y-1 ${activeStep === 'review' ? 'text-[#08a4a7]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === 'review' ? 'bg-[#08a4a7] text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <span className="text-xs">Revisão</span>
              </div>
            </div>
          )}
        </div>
        
        <div className={contentClasses}>
          {/* Conteúdo do Checkout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              {activeStep === 'shipping' && (
                <ShippingForm 
                  shippingInfo={shippingInfo} 
                  handleChange={handleShippingChange} 
                  shippingOptions={shippingOptions}
                  selectedShipping={selectedShipping}
                  handleShippingOptionChange={handleShippingOptionChange}
                />
              )}
              
              {activeStep === 'payment' && (
                <PaymentForm 
                  paymentInfo={paymentInfo} 
                  handleChange={handlePaymentChange} 
                  handlePaymentMethodChange={handlePaymentMethodChange}
                />
              )}
              
              {activeStep === 'review' && (
                <OrderReview 
                  shippingInfo={shippingInfo} 
                  paymentInfo={paymentInfo} 
                  selectedShippingOption={orderSummary.selectedShippingOption}
                  setActiveStep={setActiveStep}
                />
              )}
              
              {activeStep === 'confirmation' && (
                <OrderConfirmation shippingInfo={shippingInfo} />
              )}
              
              {/* Botões de Navegação */}
              {activeStep !== 'confirmation' && (
                <div className="flex justify-between mt-8">
                  {activeStep !== 'shipping' && (
                    <Button 
                      variant="outline" 
                      className="flex items-center" 
                      onClick={handlePreviousStep}
                      disabled={isTransitioning || isLoading}
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
                        disabled={isTransitioning || isLoading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Voltar ao Carrinho
                      </Button>
                    </Link>
                  )}
                  
                  <Button 
                    className="bg-[#08a4a7] hover:bg-[#0bdbb6] text-white ml-auto flex items-center transition-all duration-300"
                    onClick={handleNextStep}
                    disabled={(activeStep === 'shipping' && !formValidation.isShippingFormComplete) || 
                             (activeStep === 'payment' && !formValidation.isPaymentFormComplete) ||
                             isLoading || isTransitioning}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        {activeStep === 'review' ? 'Finalizar Pedido' : 'Continuar'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              {activeStep !== 'confirmation' && (
                <OrderSummary 
                  items={cartItems} 
                  subtotal={orderSummary.subtotal} 
                  shippingCost={orderSummary.shippingCost} 
                  taxes={orderSummary.taxes} 
                  total={orderSummary.orderTotal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para o formulário de envio
function ShippingForm({ 
  shippingInfo, 
  handleChange, 
  shippingOptions, 
  selectedShipping, 
  handleShippingOptionChange 
}: { 
  shippingInfo: ShippingFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  shippingOptions: Array<{id: string; name: string; price: number; description: string}>;
  selectedShipping: string;
  handleShippingOptionChange: (value: string) => void;
}) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-[#08a4a7]" />
          Informações de Envio
        </CardTitle>
        <CardDescription>Insira seus dados para entrega</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome <span className="text-red-500">*</span></Label>
            <Input
              id="firstName"
              name="firstName"
              value={shippingInfo.firstName}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome <span className="text-red-500">*</span></Label>
            <Input
              id="lastName"
              name="lastName"
              value={shippingInfo.lastName}
              onChange={handleChange}
              placeholder="Seu sobrenome"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={shippingInfo.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Endereço <span className="text-red-500">*</span></Label>
          <Input
            id="address"
            name="address"
            value={shippingInfo.address}
            onChange={handleChange}
            placeholder="Rua e número"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="addressComplement">Complemento</Label>
          <Input
            id="addressComplement"
            name="addressComplement"
            value={shippingInfo.addressComplement}
            onChange={handleChange}
            placeholder="Apartamento, bloco, etc."
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="city">Cidade <span className="text-red-500">*</span></Label>
            <Input
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              placeholder="Sua cidade"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado <span className="text-red-500">*</span></Label>
            <Select 
              name="state" 
              value={shippingInfo.state} 
              onValueChange={(value) => handleChange({ target: { name: 'state', value } } as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">AC</SelectItem>
                <SelectItem value="AL">AL</SelectItem>
                <SelectItem value="AP">AP</SelectItem>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="BA">BA</SelectItem>
                <SelectItem value="CE">CE</SelectItem>
                <SelectItem value="DF">DF</SelectItem>
                <SelectItem value="ES">ES</SelectItem>
                <SelectItem value="GO">GO</SelectItem>
                <SelectItem value="MA">MA</SelectItem>
                <SelectItem value="MT">MT</SelectItem>
                <SelectItem value="MS">MS</SelectItem>
                <SelectItem value="MG">MG</SelectItem>
                <SelectItem value="PA">PA</SelectItem>
                <SelectItem value="PB">PB</SelectItem>
                <SelectItem value="PR">PR</SelectItem>
                <SelectItem value="PE">PE</SelectItem>
                <SelectItem value="PI">PI</SelectItem>
                <SelectItem value="RJ">RJ</SelectItem>
                <SelectItem value="RN">RN</SelectItem>
                <SelectItem value="RS">RS</SelectItem>
                <SelectItem value="RO">RO</SelectItem>
                <SelectItem value="RR">RR</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="SP">SP</SelectItem>
                <SelectItem value="SE">SE</SelectItem>
                <SelectItem value="TO">TO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">CEP <span className="text-red-500">*</span></Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleChange}
              placeholder="00000-000"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">País <span className="text-red-500">*</span></Label>
          <Select 
            name="country" 
            value={shippingInfo.country} 
            onValueChange={(value) => handleChange({ target: { name: 'country', value } } as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BR">Brasil</SelectItem>
              <SelectItem value="US">Estados Unidos</SelectItem>
              <SelectItem value="CA">Canadá</SelectItem>
              <SelectItem value="PT">Portugal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Opções de Entrega</h3>
          </div>
          
          <RadioGroup 
            defaultValue={selectedShipping} 
            value={selectedShipping}
            onValueChange={handleShippingOptionChange}
            className="space-y-3"
          >
            {shippingOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:border-[#08a4a7] transition-all cursor-pointer">
                <RadioGroupItem value={option.id} id={option.id} className="text-[#08a4a7]" />
                <Label htmlFor={option.id} className="flex flex-col cursor-pointer flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{option.name}</span>
                    <span className="font-semibold">{option.price === 0 ? 'Grátis' : formatPrice(option.price)}</span>
                  </div>
                  <span className="text-sm text-gray-500">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex items-center space-x-2 pt-4">
          <input
            type="checkbox"
            id="saveInfo"
            name="saveInfo"
            checked={shippingInfo.saveInfo}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-[#08a4a7] focus:ring-[#08a4a7]"
            aria-label="Salvar informações para próximas compras"
          />
          <Label htmlFor="saveInfo" className="text-sm">
            Salvar informações para próximas compras
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para o formulário de pagamento
function PaymentForm({ 
  paymentInfo, 
  handleChange, 
  handlePaymentMethodChange 
}: { 
  paymentInfo: PaymentFormData; 
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentMethodChange: (value: 'credit-card' | 'paypal' | 'bank-transfer') => void;
}) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-[#08a4a7]" />
          Informações de Pagamento
        </CardTitle>
        <CardDescription>Escolha seu método de pagamento preferido</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="credit-card" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="credit-card" onClick={() => handlePaymentMethodChange('credit-card')}>Cartão de Crédito</TabsTrigger>
            <TabsTrigger value="paypal" onClick={() => handlePaymentMethodChange('paypal')}>PayPal</TabsTrigger>
            <TabsTrigger value="bank-transfer" onClick={() => handlePaymentMethodChange('bank-transfer')}>Transferência</TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit-card" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="cardholderName">Nome no Cartão</Label>
                <Input 
                  id="cardholderName"
                  name="cardholderName"
                  value={paymentInfo.cardholderName}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="Nome como aparece no cartão"
                  aria-label="Nome no Cartão"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input 
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="1234 5678 9012 3456"
                  aria-label="Número do Cartão"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Data de Validade</Label>
                  <Input 
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    className="mt-1"
                    aria-label="Data de Validade"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="mt-1" 
                    aria-label="Código de Segurança (CVV)"
                    required
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paypal" className="text-center py-6">
            <Image src="/paypal-logo.png" alt="PayPal" width={120} height={30} className="mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Você será redirecionado para o PayPal para completar o pagamento.</p>
            <Button className="bg-[#0070ba] hover:bg-[#005ea6] w-full max-w-xs">
              Continuar com PayPal
            </Button>
          </TabsContent>
          
          <TabsContent value="bank-transfer" className="space-y-4 py-3">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Informações Bancárias</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Banco:</span> Banco do Brasil</p>
                <p><span className="text-gray-600">Agência:</span> 1234-5</p>
                <p><span className="text-gray-600">Conta:</span> 67890-1</p>
                <p><span className="text-gray-600">Titular:</span> Global Book Store S.A.</p>
                <p><span className="text-gray-600">CNPJ:</span> 12.345.678/0001-90</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Após realizar a transferência, envie o comprovante para <strong>financeiro@globalbooks.com</strong>
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center space-x-2 pt-4">
          <input
            type="checkbox"
            id="savePaymentInfo"
            name="savePaymentInfo"
            checked={paymentInfo.savePaymentInfo}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-[#08a4a7] focus:ring-[#08a4a7]"
            aria-label="Salvar informações de pagamento"
          />
          <Label htmlFor="savePaymentInfo" className="text-sm">
            Salvar informações de pagamento para compras futuras
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para revisão do pedido
function OrderReview({ 
  shippingInfo, 
  paymentInfo, 
  selectedShippingOption, 
  setActiveStep 
}: { 
  shippingInfo: ShippingFormData; 
  paymentInfo: PaymentFormData; 
  selectedShippingOption: { id: string; name: string; price: number; description: string } | undefined;
  setActiveStep: (step: CheckoutStep) => void;
}) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-[#08a4a7]" />
          Revisar e Confirmar
        </CardTitle>
        <CardDescription>Confirme os detalhes do seu pedido antes de finalizar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações de Entrega */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Endereço de Entrega</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-[#08a4a7] hover:text-[#0bdbb6] p-0"
              onClick={() => setActiveStep('shipping')}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p className="mt-1">{shippingInfo.address}</p>
            {shippingInfo.addressComplement && <p>{shippingInfo.addressComplement}</p>}
            <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.zipCode}</p>
            <p className="mt-1">Telefone: {shippingInfo.phone}</p>
            <p>Email: {shippingInfo.email}</p>
          </div>
        </div>
        
        {/* Método de Envio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Método de Envio</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-[#08a4a7] hover:text-[#0bdbb6] p-0"
              onClick={() => setActiveStep('shipping')}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-sm flex justify-between">
            <div>
              <p className="font-medium">{selectedShippingOption?.name}</p>
              <p className="text-gray-500">{selectedShippingOption?.description}</p>
            </div>
            <p className="font-medium">
              {selectedShippingOption?.price === 0 
                ? 'Grátis' 
                : formatPrice(selectedShippingOption?.price || 0)}
            </p>
          </div>
        </div>
        
        {/* Método de Pagamento */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Método de Pagamento</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-[#08a4a7] hover:text-[#0bdbb6] p-0"
              onClick={() => setActiveStep('payment')}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            {paymentInfo.paymentMethod === 'credit-card' && (
              <div>
                <p className="font-medium">Cartão de Crédito</p>
                <p className="mt-1">
                  **** **** **** {paymentInfo.cardNumber.slice(-4)}
                </p>
                <p>Titular: {paymentInfo.cardholderName}</p>
                <p>Validade: {paymentInfo.expiryDate}</p>
              </div>
            )}
            
            {paymentInfo.paymentMethod === 'paypal' && (
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-gray-500">Você será redirecionado para o PayPal para completar o pagamento.</p>
              </div>
            )}
            
            {paymentInfo.paymentMethod === 'bank-transfer' && (
              <div>
                <p className="font-medium">Transferência Bancária</p>
                <p className="text-gray-500">Banco do Brasil - Agência: 1234-5 - Conta: 67890-1</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para resumo do pedido
function OrderSummary({ 
  items, 
  subtotal, 
  shippingCost, 
  taxes, 
  total 
}: { 
  items: Array<{product: any; quantity: number}>;
  subtotal: number;
  shippingCost: number;
  taxes: number;
  total: number;
}) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-72 overflow-y-auto px-6">
          {items.map((item, index) => (
            <div key={index} className="flex py-3 border-b border-gray-100 last:border-0">
              <div className="h-16 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-50 mr-3">
                <Image
                  src={item.product.coverImage}
                  alt={item.product.title}
                  width={50}
                  height={70}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-1">{item.product.title}</h4>
                <p className="text-xs text-gray-500">{item.product.author}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs">{formatPrice(item.product.price)} × {item.quantity}</p>
                  <p className="font-medium text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 mt-2 p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frete</span>
            <span>{shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impostos estimados</span>
            <span>{formatPrice(taxes)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-medium">
            <span>Total</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para confirmação do pedido
function OrderConfirmation({ shippingInfo }: { shippingInfo: ShippingFormData }) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="h-24 w-24 bg-[#08a4a7]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-[#08a4a7]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Pedido realizado com sucesso!</h1>
        <p className="text-gray-600">
          Obrigado pela sua compra, {shippingInfo.firstName}! Enviamos um email de confirmação para {shippingInfo.email}.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <span className="text-[#08a4a7] font-normal">Nº do Pedido:</span> #GBS-{Math.floor(100000 + Math.random() * 900000)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <h3 className="font-medium text-sm flex items-center">
              <Truck className="h-4 w-4 mr-2 text-[#08a4a7]" />
              Informações de Entrega
            </h3>
            <div className="text-sm">
              <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
              <p>{shippingInfo.address}</p>
              {shippingInfo.addressComplement && <p>{shippingInfo.addressComplement}</p>}
              <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.zipCode}</p>
            </div>
          </div>
          
          <div className="bg-[#08a4a7]/5 p-4 rounded-md">
            <h3 className="font-medium mb-2">Estado do Pedido:</h3>
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-[#08a4a7] h-4 w-4 rounded-full z-10"></div>
                <div className="ml-3">
                  <p className="font-medium text-sm">Pedido Recebido</p>
                  <p className="text-xs text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 h-4 w-4 rounded-full z-10"></div>
                <div className="ml-3">
                  <p className="font-medium text-sm text-gray-600">Em Processamento</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 h-4 w-4 rounded-full z-10"></div>
                <div className="ml-3">
                  <p className="font-medium text-sm text-gray-600">Em Trânsito</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gray-200 h-4 w-4 rounded-full z-10"></div>
                <div className="ml-3">
                  <p className="font-medium text-sm text-gray-600">Entregue</p>
                </div>
              </div>
              
              <div className="absolute left-[7px] top-4 h-[calc(100%-28px)] w-0.5 bg-gray-200 z-0"></div>
              <div className="absolute left-[7px] top-4 h-3 w-0.5 bg-[#08a4a7] z-0"></div>
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Você pode acompanhar seu pedido na área <strong>"Meus Pedidos"</strong> da sua conta.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Voltar para a Loja
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button className="bg-[#08a4a7] hover:bg-[#0bdbb6] w-full sm:w-auto">
                  Ver meus Pedidos
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 