import axios from "axios"
import { useEffect, useState } from "react";
import Camera from "./Components/Camera";

function App() {
    useEffect(() => {
        fetchSample()
    }, [])

    const [data, setData] = useState('')
    const [isOpen, setIsOpen] = useState(true)

    function handleCamera() { 
        setIsOpen(!isOpen) 
    }

    function fetchSample() {
        axios({
            method: 'GET', 
            url: 'http://127.0.0.1:5000/'
        })
            .then(res => {
                setData(res?.data)
            })
            .catch(err => { 
                console.log('err :>> ', err);
                alert(err)
            })
    }

    return (
        <>
            <div>
                Text: {data}
                {isOpen && <Camera />}

                <div>
                    <button className="text-2xl" onClick={handleCamera}>
                        Click to {isOpen ? 'Close' : 'Open'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default App
