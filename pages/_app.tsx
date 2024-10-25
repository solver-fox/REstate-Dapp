import Header from '@/components/Header'
import '@/styles/global.css'
import { Providers } from '@/services/provider'
import { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'

export default function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState<boolean>(false)

  useEffect(() => setShowChild(true), [])

  if (!showChild || typeof window === 'undefined') {
    return null
  } else {
    return (
      <Providers pageProps={pageProps}>
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Background grid overlay */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          {/* Decorative glow */}
          <div className="fixed right-0 top-0 -translate-y-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="fixed left-0 bottom-0 translate-y-12 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>

          {/* Content wrapper */}
          <div className="relative">
            <Header />
            <Component {...pageProps} />
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
            <footer className="text-center py-20 text-gray-400 text-sm">
              © 2024 HemiVent. All rights reserved.
            </footer>
          </div>
        </div>
      </Providers>
    )
  }
}
