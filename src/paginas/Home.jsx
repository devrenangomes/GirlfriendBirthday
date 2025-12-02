import React, { useState, useEffect } from 'react';
import { Heart, Gift, Mail, Search, X, Smile, Star, Utensils, Music, Coins, Camera } from 'lucide-react';
import Confetti from '../componentes/Confetti';
import fotoCasal from '../assets/imagens/foto-casal.jpg';

export default function BirthdayApp() {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); // Estado de contagem trazido de volta
  const [showContent, setShowContent] = useState(false);
  const [showIntroConfetti, setShowIntroConfetti] = useState(false); // Confete específico da intro

  // Estado da Carta
  const [letterFound, setLetterFound] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [letterPos, setLetterPos] = useState({ top: '65%', left: '25%', rotate: '12deg' });

  // Estado da Roleta
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [prankCount, setPrankCount] = useState(0);

  // --- CONFIGURAÇÃO DA ROLETA ---
  const gifts = [
    { label: "Jantar Chique", type: "good", icon: <Utensils size={20} /> }, // 0
    { label: "2 Reais", type: "bad", icon: <Coins size={20} /> },           // 1
    { label: "Dia de SPA", type: "good", icon: <Star size={20} /> },        // 2
    { label: "1 BigBig", type: "bad", icon: <Smile size={20} /> },          // 3
    { label: "Bolsa Nova", type: "good", icon: <Gift size={20} /> },        // 4
    { label: "Dizer que tô certo", type: "bad", icon: <Heart size={20} /> }, // 5
    { label: "Viagem Surpresa", type: "good", icon: <Music size={20} /> },  // 6
    { label: "Lavar a Louça", type: "bad", icon: <Search size={20} /> },    // 7
  ];

  const SEGMENT_ANGLE = 360 / gifts.length;

  // --- EFEITOS ---

  // Animação de Entrada (Contador Numérico Rápido)
  useEffect(() => {
    // Define a posição da carta aleatoriamente
    setLetterPos({
      top: `${Math.random() * 60 + 20}%`,
      left: `${Math.random() * 60 + 20}%`,
      rotate: `${Math.random() * 360}deg`
    });

    let interval = null;

    // Se ainda não chegou em 20, continua contando
    if (count < 20) {
      interval = setInterval(() => {
        setCount((prev) => {
          const next = prev + 1;
          // Se o próximo número for 20, explode o confete E abre o site
          if (next === 20) {
            setShowIntroConfetti(true);
            setLoading(false);
            setShowContent(true);
          }
          return next;
        });
      }, 80); // Velocidade acelerada (80ms)
    }

    return () => clearInterval(interval);
  }, [count]);

  // Função de Girar a Roleta (A PEGADINHA)
  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);

    // Lógica da Pegadinha: Sempre cair em um índice ÍMPAR (Bad gifts)
    const badIndices = [1, 3, 5, 7];
    const forcedIndex = badIndices[Math.floor(Math.random() * badIndices.length)];

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const baseRotation = extraSpins * 360;

    const segmentCenter = (forcedIndex * SEGMENT_ANGLE) + (SEGMENT_ANGLE / 2);
    const targetRotation = baseRotation - segmentCenter;

    const safeZone = (SEGMENT_ANGLE / 2) - 5;
    const randomOffset = Math.floor(Math.random() * (safeZone * 2)) - safeZone;

    setRotation(targetRotation + randomOffset);

    setTimeout(() => {
      setSpinning(false);
      setPrize(gifts[forcedIndex]);
      setPrankCount(prev => prev + 1);
    }, 4000);
  };

  const wheelGradient = `conic-gradient(
    ${gifts.map((_, i) => {
    const color = i % 2 === 0 ? '#FFE4E6' : '#FECDD3';
    const start = i * SEGMENT_ANGLE;
    const end = (i + 1) * SEGMENT_ANGLE;
    return `${color} ${start}deg ${end}deg`;
  }).join(', ')}
  )`;

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center font-serif text-rose-600 overflow-hidden relative">
        {showIntroConfetti && <Confetti />}

        {/* Contador Gigante */}
        <div className="relative z-10 scale-150 transform transition-all duration-300">
          <span className="text-9xl font-bold tracking-tighter drop-shadow-md">
            {count}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 font-sans selection:bg-rose-200 overflow-x-hidden">
      {/* Confete também na tela principal se recém entrou */}
      {showContent && <Confetti />}

      {/* HEADER HERO */}
      <header className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-rose-100 to-rose-50 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 transform rotate-12"><Heart size={64} /></div>
          <div className="absolute bottom-20 right-10 transform -rotate-12"><Star size={48} /></div>
          <div className="absolute top-1/2 left-4 transform rotate-45"><Gift size={32} /></div>
        </div>

        <div className="z-10 animate-fade-in-up">
          <h2 className="text-xl md:text-2xl font-body tracking-[0.2em] text-rose-400 mb-2">FELIZ ANIVERSÁRIO</h2>
          <h1 className="text-6xl md:text-8xl font-hand text-rose-600 mb-6 drop-shadow-sm">
            20 Anos
          </h1>
          <p className="max-w-md mx-auto text-slate-600 font-body leading-relaxed mb-8">
            Hoje o dia é todo seu! Preparei algumas surpresas interativas.
            Role para baixo para começar a brincadeira.
          </p>
          <div className="animate-bounce">
            <Search className="mx-auto text-rose-400" size={32} />
          </div>
        </div>
      </header>

      {/* JOGO: ENCONTRE A CARTA */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-hand text-rose-600 mb-2">Desafio 1: Cadê a Carta?</h2>
          <p className="text-sm text-slate-500">Tem uma cartinha escondida no meio dessa bagunça romântica.<br />Dica: Ela está bem camuflada!</p>
        </div>

        {/* Área do Jogo */}
        <div className="relative w-full max-w-md mx-auto h-96 bg-rose-50 rounded-xl border-4 border-dashed border-rose-200 overflow-hidden shadow-inner cursor-crosshair">
          {!letterFound ? (
            <>
              {/* Elementos Distratores (Aumentado para 60 itens para dificultar) */}
              {[...Array(60)].map((_, i) => (
                <div
                  key={i}
                  className="absolute transition-opacity select-none pointer-events-none"
                  style={{
                    top: `${Math.random() * 90 + 5}%`,
                    left: `${Math.random() * 90 + 5}%`,
                    transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.4 + 0.4})`,
                    // Cores variadas mas próximas da cor da carta para confundir
                    color: ['#FDA4AF', '#F43F5E', '#BE123C', '#FB7185'][Math.floor(Math.random() * 4)],
                    opacity: Math.random() * 0.5 + 0.3
                  }}
                >
                  {/* Mistura ícones parecidos */}
                  {[<Heart size={32} />, <Star size={24} />, <Smile size={28} />, <Mail size={24} className="opacity-20" />][Math.floor(Math.random() * 4)]}
                </div>
              ))}

              {/* A CARTA ESCONDIDA (DIFÍCIL) */}
              <button
                onClick={() => {
                  setLetterFound(true);
                  setIsLetterOpen(true);
                }}
                className="absolute z-20 group outline-none focus:outline-none tap-transparent"
                style={{
                  top: letterPos.top,
                  left: letterPos.left,
                  transform: `rotate(${letterPos.rotate}) scale(0.9)` // Rotaciona igual aos outros
                }}
              >
                <div className="relative transition-transform duration-200 active:scale-95">
                  {/* A carta agora tem a mesma cor dos distratores (rose-500) para camuflar.
                        Removemos o 'ping' e o ponto vermelho. */}
                  <Mail
                    size={26}
                    className="text-rose-500 opacity-90 hover:opacity-100 hover:scale-110 hover:text-rose-600 transition-all duration-300 drop-shadow-sm"
                  />
                </div>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
              <Mail size={64} className="text-rose-500 mb-4" />
              <h3 className="text-xl font-hand text-rose-600 mb-2">Você encontrou!</h3>
              <button
                onClick={() => setIsLetterOpen(true)}
                className="bg-rose-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-rose-600 transition"
              >
                Ler Novamente
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MODAL DA CARTA COM FOTO */}
      {isLetterOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-2xl max-w-lg w-full shadow-2xl relative animate-scale-up border-t-8 border-rose-400 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsLetterOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 bg-white rounded-full p-1"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-4 flex-shrink-0">
              <h3 className="font-hand text-3xl text-rose-800">Para meu Amor</h3>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar">
              {/* ÁREA DA FOTO (CARD) */}
              <div className="bg-slate-100 p-3 pb-8 rounded-sm shadow-md rotate-1 mb-6 mx-auto w-fit transform hover:rotate-0 transition-transform duration-500">
                <div className="w-64 h-52 bg-slate-200 overflow-hidden flex items-center justify-center relative group">
                  {/* Placeholder para a foto dela/de vocês */}
                  <img
                    src={fotoCasal}
                    alt="Nossa Foto"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition">
                    <Camera className="text-white opacity-50 group-hover:opacity-0" />
                  </div>
                </div>
                <div className="text-center mt-3 font-hand text-xl text-slate-600">
                  Nós dois ❤️
                </div>
              </div>

              {/* TEXTO DA CARTA */}
              <div className="prose prose-rose font-body text-slate-600 leading-relaxed text-sm md:text-base text-justify px-2">
                <p>Oi, meu amor!</p>
                <p>
                  Chegar aos 20 anos é um marco incrível, e eu sou muito sortudo por estar ao seu lado vendo você se tornar essa mulher maravilhosa.
                </p>
                <p>
                  Você traz cor para os meus dias cinzas e sorriso para o meu rosto sem nem fazer esforço. Que esse novo ciclo seja repleto de conquistas, saúde e, claro, muito nós dois.
                </p>
                <p>
                  Eu te amo mais do que ontem e menos que amanhã.
                  <br />
                  <strong>Feliz Aniversário!</strong>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-rose-100 text-center flex-shrink-0">
              <p className="text-xs text-slate-400 italic">
                (Agora pode fechar e ir girar a roleta lá embaixo...)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ROLETA DE PRESENTES */}
      <section className="py-20 px-4 bg-gradient-to-b from-rose-50 to-white overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-hand text-rose-600 mb-2">Sua Roleta da Sorte</h2>
          <p className="text-sm text-slate-500 mb-8">
            Você tem direito a 1 giro! O que cair, é seu. <br />
            <span className="text-xs opacity-70">(Confia, sou um namorado justo)</span>
          </p>

          <div className="relative w-80 h-80 mx-auto mb-12">
            {/* Indicador (Seta) */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 text-slate-800 drop-shadow-xl">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[30px] border-t-rose-600 border-r-[15px] border-r-transparent"></div>
            </div>

            {/* A Roleta */}
            <div
              className="w-full h-full rounded-full border-4 border-white shadow-2xl relative transition-transform cubic-bezier(0.2, 0.8, 0.2, 1)"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: '4000ms',
                background: wheelGradient
              }}
            >
              {gifts.map((item, index) => {
                const rotate = (index * SEGMENT_ANGLE) + (SEGMENT_ANGLE / 2);

                return (
                  <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{
                      transform: `rotate(${rotate}deg)`
                    }}
                  >
                    <div
                      className="absolute w-full text-center pt-6 top-0 left-0 text-rose-900 font-bold text-xs"
                    >
                      <div className="flex flex-col items-center justify-center">
                        {item.icon}
                        <span className="max-w-[70px] leading-tight mt-1 px-1 bg-white/20 rounded backdrop-blur-[1px]">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={spinWheel}
              disabled={spinning}
              className={`
                px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform
                ${spinning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:scale-105 hover:shadow-rose-300/50'
                }
              `}
            >
              {spinning ? 'Girando...' : prankCount > 0 ? 'Tentar de novo (Vai que...)' : 'GIRAR AGORA'}
            </button>

            {prize && (
              <div className="mt-8 animate-bounce-in p-6 bg-white rounded-xl shadow-lg border border-rose-100 max-w-sm mx-auto">
                <p className="text-slate-500 text-sm uppercase tracking-wide">Parabéns! Você ganhou:</p>
                <h3 className="text-2xl font-bold text-rose-600 my-2">{prize.label}</h3>
                <p className="text-sm italic text-slate-400">
                  {prankCount < 3 ? "Ops... a roleta deve estar emperrada." : "É, acho que é o destino mesmo amor."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-rose-100 py-8 text-center text-rose-400 text-sm font-body">
        <p>Feito com ❤️ para o amor da minha vida.</p>
        <p className="text-xs opacity-60 mt-1">© {new Date().getFullYear()} - 20 Anos</p>
      </footer>
    </div>
  );
}
