import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Layout from "../Layout/Layout";
import SignToText from "../Pages/SignToText";
import TextToSign from "../Pages/TextToSign";


const router = createBrowserRouter([
    {
        path: '/', 
        element: <Layout />, 
        errorElement: 'Error', 
        children: [
            {
                path: '/', 
                element: <Home />
            }, 
            {
                path: 'sign-to-text', 
                element: <SignToText />
            }, 
            {
                path: 'text-to-sign', 
                element: <TextToSign />
            }
        ]
    }
])

export { router }