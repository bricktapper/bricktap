import { FC, ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode; // Использование ReactNode для children
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header/>
      {children}
      <Footer />
    </>
  );
};