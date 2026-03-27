import React, { useEffect, useState, useRef } from 'react'
import Camera from '../Components/Camera'

export default function SignToText() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentLetter, setCurrentLetter] = useState('')
    const [displayLetter, setDisplayLetter] = useState('')
    const [word, setWord] = useState('')
    const [animationKey, setAnimationKey] = useState(0)
    const scrollRef = useRef(null)

    const handleNewLetter = (letter) => {
        if (!letter) return;
        if (letter !== currentLetter) {
            setCurrentLetter(letter);
            setAnimationKey(prev => prev + 1);

            // Show a visual indicator for special gestures
            if (letter === 'space') {
                setDisplayLetter('␣');
            } else if (letter === 'del') {
                setDisplayLetter('⌫');
            } else {
                setDisplayLetter(letter);
            }
        }
    }

    useEffect(() => {
        if (!currentLetter || !isOpen) return;
        
        const timeout = setTimeout(() => {
            if (currentLetter === 'space') {
                setWord(prev => prev + ' ');
            } else if (currentLetter === 'del') {
                setWord(prev => prev.slice(0, -1));
            } else {
                setWord(prev => prev + currentLetter);
            }
        }, 2000); 

        return () => clearTimeout(timeout);
    }, [currentLetter, isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [word]);

    return (
        <div className="flex flex-col md:flex-row h-dvh w-full bg-[#0a0a0a] text-white font-['Inter'] overflow-hidden">
            
            <div className="w-full md:w-[70%] h-[55vh] md:h-dvh p-4 md:p-8 flex flex-col justify-center relative">
                
                {/* Camera View */}
                <div className="w-full flex-1 md:flex-none md:h-[90%] relative bg-gray-900 rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500">
                    
                    {isOpen ? (
                        <Camera onLetterPredict={handleNewLetter} />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <p className="text-lg md:text-xl tracking-widest uppercase font-light">Camera Offline</p>
                        </div>
                    )}
                    
                    {/* Desktop Toggle */}
                    <button 
                        onClick={() => {
                            setIsOpen(!isOpen)
                            if (isOpen) { setCurrentLetter(''); setWord(''); }
                        }}
                        className={`hidden md:flex absolute bottom-8 right-8 backdrop-blur-md px-8 py-4 rounded-full text-base font-semibold tracking-wide transition-all duration-300 shadow-2xl items-center gap-3 border ${
                            isOpen 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' 
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20'
                        }`}
                    >
                        <div className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}></div>
                        {isOpen ? 'Stop Camera' : 'Start Camera'}
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button 
                    onClick={() => {
                        setIsOpen(!isOpen)
                        if (isOpen) { setCurrentLetter(''); setWord(''); }
                    }}
                    className={`md:hidden mt-4 w-full flex justify-center backdrop-blur-md px-6 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 shadow-lg items-center gap-2 border ${
                        isOpen 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' 
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20'
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`}></div>
                    {isOpen ? 'Stop Camera' : 'Start Camera'}
                </button>
                
            </div>

            <div className="w-full md:w-[30%] h-[50vh] md:h-screen bg-black border-t md:border-t-0 md:border-l border-white/5 p-4 md:p-8 flex flex-col items-center relative">
                
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    <h2 className="text-xs md:text-sm text-gray-500 uppercase tracking-[0.3em] font-semibold mb-2 md:mb-8">Prediction</h2>
                    
                    <div className="relative">
                        <span 
                            key={animationKey}
                            className="text-[8rem] md:text-[14rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 block leading-none transition-all duration-300"
                        >
                            {displayLetter}
                        </span>
                    </div>
                </div>

                <div className="w-full mt-4 md:mt-0 mb-4 md:mb-8 flex flex-col shrink-0">
                    <div className="flex w-full justify-between items-end mb-2 md:mb-4">
                        <h3 className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">Word</h3>
                        <button 
                            onClick={() => setWord('')} 
                            className="text-[10px] md:text-xs text-gray-600 hover:text-red-400 transition-colors uppercase tracking-wider"
                        >
                            Clear
                        </button>
                    </div>
                    
                    <div 
                        ref={scrollRef}
                        className="w-full bg-[#111] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 h-[100px] md:h-[160px] flex items-start shadow-inner overflow-y-auto scroll-smooth"
                    >
                        <p className="text-xl md:text-3xl font-medium tracking-wide text-cyan-50 leading-relaxed break-words whitespace-pre-wrap w-full">
                            {word}
                            <span className="inline-block w-1 h-5 md:h-8 ml-1 bg-cyan-500 animate-pulse align-middle translate-y-[0px] md:translate-y-[-2px]"></span>
                        </p>
                    </div>
                </div>
                
            </div>
            
        </div>
    )
}
