import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, ExternalLink, X, Laptop } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        title="Instalar Finanças Pro no Windows / Celular"
      >
        <Download className="w-4 h-4" />
        <span>Instalar App</span>
      </button>

      {/* Installation Guide Modal (For Desktop Preview / Windows / Chrome / iOS) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 p-7 shadow-2xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-orange-500">
                <Laptop className="w-5 h-5" />
                <h3 className="text-lg font-bold font-display">Como Instalar no Windows 11</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <p>
                Os navegadores (Chrome / Edge) só permitem a instalação direta quando o site é aberto em <strong>sua própria aba</strong> (fora do quadro de pré-visualização).
              </p>

              <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-2xl flex flex-col gap-2 border border-stone-200 dark:border-stone-700">
                <p className="font-semibold text-stone-900 dark:text-stone-100">Passo a Passo Simples:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-stone-700 dark:text-stone-300">
                  <li>Clique no botão abaixo para <strong>Abrir em Nova Aba</strong>.</li>
                  <li>Na nova aba, clique no ícone de instalação <kbd className="bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded text-[10px]">⊕</kbd> na barra de endereços do Chrome/Edge (ou no botão "Instalar App").</li>
                  <li>O aplicativo será adicionado à sua **Área de Trabalho** e **Menu Iniciar** do Windows 11!</li>
                </ol>
              </div>

              {isIOS && (
                <div className="bg-amber-500/10 text-amber-700 dark:text-amber-300 p-3 rounded-xl">
                  <strong>No iPhone/iPad:</strong> Toque no botão <i>Compartilhar</i> do Safari e selecione <i>Adicionar à Tela de Início</i>.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={openInNewTab}
                className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-2xl shadow-md shadow-orange-500/20 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir em Nova Aba</span>
              </button>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium px-5 py-3 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
