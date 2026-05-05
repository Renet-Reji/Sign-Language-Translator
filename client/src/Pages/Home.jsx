import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../Config/axiosInstance'

export default function Home() {
    const navigate = useNavigate()

    useEffect(() => {
        axiosInstance({
            method: 'get', 
            url: '/'
        })
            .then((res) => {
                console.log(res)
            })
    }, [])

    return (
        <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white font-['Inter'] overflow-hidden flex flex-col items-center justify-center p-6 md:p-12">

            {/* Background Aesthetic Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center max-w-5xl w-full">

                {/* Header Subtext & Title */}
                <div className="text-center mb-16 space-y-6">

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600">Sign Language</span> Translation
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Convert gestures to text and text to sign instantly. Built for seamless, two-way communication without delays or barriers.
                    </p>
                </div>

                {/* Application Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

                    {/* Sign to Text Feature Card */}
                    <div
                        onClick={() => navigate('/sign-to-text')}
                        className="group relative flex flex-col items-center text-center bg-[#111] border border-white/5 rounded-[2rem] p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.3)] hover:border-cyan-500/30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="w-20 h-20 mb-8 rounded-[1.5rem] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-cyan-500/10">
                            <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10h.01" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold mb-4 tracking-wide text-white group-hover:text-cyan-300 transition-colors duration-300">Sign to Text</h2>

                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                            Translate real-world hand gestures into text instantly using your camera. Powered by high-speed spatial mapping.
                        </p>

                        <div className="mt-8 flex items-center text-cyan-500 font-semibold tracking-wider text-sm uppercase">
                            Launch Module
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>

                    {/* Text to Sign Feature Card */}
                    <div
                        onClick={() => navigate('/text-to-sign')}
                        className="group relative flex flex-col items-center text-center bg-[#111] border border-white/5 rounded-[2rem] p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] hover:border-blue-500/30"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="w-20 h-20 mb-8 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-blue-500/10">
                            <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold mb-4 tracking-wide text-white group-hover:text-blue-300 transition-colors duration-300">Text to Sign</h2>

                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                            Type your message and watch a dynamic 3D avatar translate it into fluid, accurately articulated sign language.
                        </p>

                        <div className="mt-8 flex items-center text-blue-500 font-semibold tracking-wider text-sm uppercase">
                            Launch Module
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}