import React from 'react';
import { ElHeader } from '../ElLayout/ElHeader';
import { BottomNav } from '../ElLayout/BottomNav';

interface PageLayoutProps {
  children: React.ReactNode;
  isAppPage?: boolean;
  showFooter?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, isAppPage = false }) => {
  return (
    <>
      <ElHeader hideMenu={isAppPage} />
      <main className={`min-h-screen${isAppPage ? ' pb-20' : ''}`}>
        {children}
      </main>
      {isAppPage && <BottomNav />}
    </>
  );
};

export default PageLayout;
