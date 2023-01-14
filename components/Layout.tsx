import React, { ReactElement, ReactNode } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

type Props = {};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-8xl mx-auto scrollbar-thin scrollbar-track-black">
      <Navbar />
      <main className="mt-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
