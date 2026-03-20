import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirigir a la torre de control
  redirect('/tower');
}