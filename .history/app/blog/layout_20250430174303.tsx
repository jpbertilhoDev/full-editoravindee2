import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | EcCoMerc',
  description: 'Dicas, tutoriais e notícias sobre e-commerce, marketing digital e tendências do mercado online.',
  openGraph: {
    title: 'Blog | EcCoMerc',
    description: 'Dicas, tutoriais e notícias sobre e-commerce, marketing digital e tendências do mercado online.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 