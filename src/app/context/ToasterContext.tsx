"use client";

import { Toaster } from "react-hot-toast";
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

function ToasterContext() {
    return (
        <Toaster 
            toastOptions={{
                className: inter.className,
                style: {
                    fontWeight: 500
                  },              
            }}
        />
    )
}

export default ToasterContext;