import React from 'react';
import { LoginView } from '../auth/LoginView';
import { X } from 'lucide-react';
import { AppRole } from '../../types';

interface LoginPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAs: (role: AppRole, username?: string) => void;
}

export const LoginPortalModal: React.FC<LoginPortalModalProps> = ({
  isOpen,
  onClose,
  onLoginAs
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative my-auto max-w-md w-full">
        {/* Close Button on top right */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-60 w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-900 shadow-md border border-slate-200 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
          title="Tutup Jendela Login"
        >
          <X className="w-4 h-4" />
        </button>

        <LoginView
          isModal={true}
          onLoginSuccess={(role, username) => onLoginAs(role, username)}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
