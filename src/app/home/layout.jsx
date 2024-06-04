import './app.css'
import Script from 'next/script'
import Navbar from './components/Navbar'

export default function HomeLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div className='container'>{children}</div>
            <Script src="/plugins/jquery/jquery.min.js"></Script>
            <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></Script>
        </div>
    )
}