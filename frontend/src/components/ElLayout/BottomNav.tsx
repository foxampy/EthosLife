import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Sparkles, LayoutDashboard, Users, ShoppingBag } from 'lucide-react';
import { BurgerMenuPanel } from './BurgerMenuPanel';

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href?: string;
  action?: 'burger';
}

const navItems: NavItem[] = [
  { id: 'menu', icon: Menu, label: 'Меню', action: 'burger' },
  { id: 'ai', icon: Sparkles, label: 'ИИ', href: '/ai/chat' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд', href: '/dashboard' },
  { id: 'contacts', icon: Users, label: 'Контакты', href: '/contacts' },
  { id: 'shop', icon: ShoppingBag, label: 'Магазин', href: '/shop' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [burgerOpen, setBurgerOpen] = useState(false);

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/dashboard2';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className="flex items-center justify-around px-2 py-2"
          style={{
            background: 'var(--bone-200, #e8e0d5)',
            boxShadow: '-2px -4px 12px rgba(44,40,34,0.08), 0 -1px 0 rgba(255,255,255,0.6)',
          }}
        >
          {navItems.map((item) => {
            const active = item.action === 'burger' ? burgerOpen : isActive(item.href);
            return (
              <motion.button
                key={item.id}
                onClick={() =>
                  item.action === 'burger'
                    ? setBurgerOpen(true)
                    : item.href && navigate(item.href)
                }
                className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl relative min-w-[56px] transition-all"
                whileTap={{ scale: 0.92 }}
                style={{
                  background: active
                    ? 'linear-gradient(135deg, #5c5243, #8c7a6b)'
                    : 'transparent',
                  boxShadow: active
                    ? '0 4px 12px rgba(92,82,67,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
                    : 'none',
                }}
              >
                <item.icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: active ? 'white' : '#8c7a6b' }}
                />
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: active ? 'white' : '#a09282' }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {burgerOpen && <BurgerMenuPanel onClose={() => setBurgerOpen(false)} />}
      </AnimatePresence>
    </>
  );
};
