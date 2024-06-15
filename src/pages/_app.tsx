import { store } from '@/app/store'
import Header from '@/components/Header'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router';
import Head from 'next/head';



export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;

  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/':
        return 'Cryptopia | Home';
      default:
        return 'Cryptopia';
    }
  };
  const pageTitle = getPageTitle(pathname);

  return (
    <Provider store={store}>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="/favicon.ico" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      <div className="App primary-bg min-h-screen text-white">
        <Header />
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}
