import './app.css'
import Script from 'next/script'
import Navbar from './components/Navbar'

export default function HomeLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div className='container'>{children}</div>
            <Script src="/plugins/jquery/jquery.min.js" />
            <Script src="/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js" />
        </div>
    )
}