import Banner from '@/components/Banner/Banner';
import 'react-alice-carousel/lib/alice-carousel.css';
import CoinsTable from '@/components/CoinsTable';


export default function Home() {
  return (
    <div style={{ fontFamily: "Montserrat" }}>
      <Banner />
      <CoinsTable />
    </div>
  )
}
