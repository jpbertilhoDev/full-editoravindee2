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
          <MapPin className="h-5 w-5 mr-2 text-[#26a69a]" />
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
              <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:border-[#26a69a] transition-all cursor-pointer">
                <RadioGroupItem value={option.id} id={option.id} className="text-[#26a69a]" />
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
            className="h-4 w-4 rounded border-gray-300 text-[#26a69a] focus:ring-[#26a69a]"
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
          <CreditCard className="h-5 w-5 mr-2 text-[#26a69a]" />
          Informações de Pagamento
        </CardTitle>
        <CardDescription>Escolha seu método de pagamento preferido</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={paymentInfo.paymentMethod} onValueChange={(value: any) => handlePaymentMethodChange(value)}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="credit-card" className="data-[state=active]:text-[#26a69a]">
              Cartão de Crédito
            </TabsTrigger>
            <TabsTrigger value="paypal" className="data-[state=active]:text-[#26a69a]">
              PayPal
            </TabsTrigger>
            <TabsTrigger value="bank-transfer" className="data-[state=active]:text-[#26a69a]">
              Transferência
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit-card" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Nome no Cartão <span className="text-red-500">*</span></Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                value={paymentInfo.cardholderName}
                onChange={handleChange}
                placeholder="Exatamente como aparece no cartão"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  required
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <img src="/visa.svg" alt="Visa" className="h-4" />
                  <img src="/mastercard.svg" alt="Mastercard" className="h-4" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Validade <span className="text-red-500">*</span></Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV <span className="text-red-500">*</span></Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handleChange}
                  placeholder="000"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="savePaymentInfo"
                name="savePaymentInfo"
                checked={paymentInfo.savePaymentInfo}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[#26a69a] focus:ring-[#26a69a]"
              />
              <Label htmlFor="savePaymentInfo" className="text-sm">
                Salvar informações do cartão para compras futuras
              </Label>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md flex items-start mt-4">
              <LockClosed className="h-4 w-4 text-[#26a69a] mr-2 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600">
                Seus dados são criptografados com segurança usando o protocolo SSL. Não armazenamos o número completo do seu cartão.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="paypal" className="py-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img src="/paypal-logo.png" alt="PayPal" className="h-8" />
              </div>
              <p className="text-sm text-gray-600 mb-6">Você será redirecionado para o PayPal para completar seu pagamento com segurança.</p>
              <Button className="bg-[#0070ba] hover:bg-[#005ea6] w-full max-w-xs mx-auto flex items-center justify-center">
                Continuar com PayPal
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="bank-transfer" className="py-6 space-y-4">
            <div className="border rounded-md p-4 bg-gray-50 space-y-3">
              <h3 className="font-medium">Dados Bancários:</h3>
              <div>
                <p className="text-sm">Banco: <span className="font-medium">Banco do Brasil</span></p>
                <p className="text-sm">Agência: <span className="font-medium">1234-5</span></p>
                <p className="text-sm">Conta: <span className="font-medium">67890-1</span></p>
                <p className="text-sm">Favorecido: <span className="font-medium">Grace Bookstore LTDA</span></p>
                <p className="text-sm">CNPJ: <span className="font-medium">12.345.678/0001-90</span></p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm text-yellow-800 flex items-start">
              <Info className="h-4 w-4 mt-0.5 mr-2 shrink-0" />
              <p>Seu pedido será processado após confirmarmos o pagamento. Envie o comprovante para financeiro@gracebookstore.com.</p>
            </div>
          </TabsContent>
        </Tabs>
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
          <CheckCircle className="h-5 w-5 mr-2 text-[#26a69a]" />
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
              className="h-8 text-[#26a69a] hover:text-[#2bbbad] p-0"
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
              className="h-8 text-[#26a69a] hover:text-[#2bbbad] p-0"
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
              className="h-8 text-[#26a69a] hover:text-[#2bbbad] p-0"
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
        <div className="h-24 w-24 bg-[#26a69a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-[#26a69a]" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Pedido realizado com sucesso!</h1>
        <p className="text-gray-600">
          Obrigado pela sua compra, {shippingInfo.firstName}! Enviamos um email de confirmação para {shippingInfo.email}.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <span className="text-[#26a69a] font-normal">Nº do Pedido:</span> #GBS-{Math.floor(100000 + Math.random() * 900000)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <h3 className="font-medium text-sm flex items-center">
              <Truck className="h-4 w-4 mr-2 text-[#26a69a]" />
              Informações de Entrega
            </h3>
            <div className="text-sm">
              <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
              <p>{shippingInfo.address}</p>
              {shippingInfo.addressComplement && <p>{shippingInfo.addressComplement}</p>}
              <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.zipCode}</p>
            </div>
          </div>
          
          <div className="bg-[#26a69a]/5 p-4 rounded-md">
            <h3 className="font-medium mb-2">Estado do Pedido:</h3>
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="bg-[#26a69a] h-4 w-4 rounded-full z-10"></div>
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
              <div className="absolute left-[7px] top-4 h-3 w-0.5 bg-[#26a69a] z-0"></div>
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
                <Button className="bg-[#26a69a] hover:bg-[#2bbbad] w-full sm:w-auto">
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