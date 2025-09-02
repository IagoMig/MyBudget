import React, { useEffect } from 'react';
import { WalletIcon } from 'lucide-react';
interface SplashScreenProps {
  onComplete: () => void;
}
const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return <div className="fixed inset-0 flex flex-col items-center justify-center bg-blue-600 text-white">
      <div className="animate-pulse">
        <WalletIcon size={80} className="mb-4" />
      </div>
      <h1 className="text-4xl font-bold mb-2">MyBudget</h1>
      <p className="text-sm opacity-80">
        Desenvolvido exclusivamente por Iago Miguel 
      </p>
    </div>;
};
export default SplashScreen;