"use client";

import React, { useEffect,useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LogIn, Menu, X, Bell, LogOut, User, LayoutDashboard, BookOpen, Heart, FolderKanban } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/src/components/providers/AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = useMemo(() => {
    if (!user) {
      return [
        { name: 'Accueil', path: '/' },
        { name: 'Démarches', path: '/process' },
      ];
    }
    
    const userRole = user.user_type?.toLowerCase();

    switch (userRole) {
      case 'etudiant':
      case 'student':
        return [
          { name: 'Tableau de bord', path: '/student', icon: LayoutDashboard },
          { name: 'Catalogue', path: '/student/catalog', icon: BookOpen },
          { name: 'Mes vœux', path: '/student/wishes', icon: Heart },
        ];
      case 'encadrant':
      case 'supervisor':
      case 'teacher':
        return [
          { name: 'Tableau de bord', path: '/supervisor', icon: LayoutDashboard },
          { name: 'Projets', path: '/supervisor/projects', icon: FolderKanban },
        ];
      case 'admin':
        return [
          { name: 'Vue d\'ensemble', path: '/admin' },
        ];
      default:
        return [];
    }
  }, [user]);

  return (
    <nav className="bg-[#0f172a] text-white shadow-lg sticky top-0 z-50 border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="bg-white/10 p-2 rounded-lg">
              <GraduationCap className="h-8 w-8 text-blue-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white">MasterConnect</span>
              <span className="text-xs text-blue-300 uppercase tracking-widest font-semibold">Université de Paris</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  pathname === link.path ? "text-blue-300" : "text-gray-300 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-300 hover:text-white transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-blue-800">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-white">{user.username || 'Utilisateur'}</p>
                    <p className="text-xs text-blue-300 capitalize">{user.user_type}</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-blue-700 flex items-center justify-center border-2 border-blue-500">
                    <User className="h-5 w-5 text-blue-100" />
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors ml-2"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-md font-medium transition-all shadow-lg hover:shadow-blue-500/25"
              >
                <LogIn className="h-4 w-4" />
                <span>Se connecter</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
             <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-t border-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-900/50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
               <Link
                href="/login"
                className="block w-full text-center mt-4 bg-blue-600 text-white px-3 py-3 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Se connecter
              </Link>
            )}
            {user && (
                 <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="block w-full text-center mt-4 bg-red-600/10 text-red-400 border border-red-900/50 hover:bg-red-600/20 px-3 py-3 rounded-md font-medium"
              >
                Se déconnecter
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}