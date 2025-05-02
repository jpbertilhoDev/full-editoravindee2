import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | Grace Bookstore',
  description: 'Complete sua compra com segurança',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
} 