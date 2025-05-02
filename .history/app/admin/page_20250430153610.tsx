import { redirect } from 'next/navigation';
 
export default function AdminPage() {
  // Use a more immediate redirect for better performance
  redirect('/admin/dashboard');
} 