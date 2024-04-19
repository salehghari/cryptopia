import { store } from '@/app/store'
import Header from '@/components/Header'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="App primary-bg min-h-screen text-white">
        <Header />
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}
