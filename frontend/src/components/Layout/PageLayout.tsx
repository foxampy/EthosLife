/**
 * PageLayout - Universal Layout Wrapper
 * Wraps ALL pages with Header and consistent styling
 */

import React from 'react';
import { ElHeader } from '../ElLayout/ElHeader';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <>
      <ElHeader />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
};

export default PageLayout;
