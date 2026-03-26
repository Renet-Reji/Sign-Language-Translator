import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col gap-4 items-center justify-center h-screen'>
            <button onClick={() => navigate('/sign-to-text')} className='text-2xl border-2 border-black p-2 rounded-lg hover:bg-black hover:text-white'>Sign to Text</button>
            <button onClick={() => navigate('/text-to-sign')} className='text-2xl border-2 border-black p-2 rounded-lg hover:bg-black hover:text-white'>Text to Sign</button>
        </div>
    )
}
 