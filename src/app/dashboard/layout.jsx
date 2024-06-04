import "./app.css";
import ControlSidebar from "./components/ControlSidebar";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Script from "next/script";

export default function DashboardLayout({ children }) {
  return (
    <div className="hold-transition sidebar-mini layout-fixed">
      <div className="wrapper">
        <Navbar />
        <Sidebar />
        <div className="content-wrapper p-2">{children}</div>
        <Footer />
        <ControlSidebar />
      </div>
      <Script src="/plugins/jquery/jquery.min.js" />
      <Script src="/plugins/jquery-ui/jquery-ui.min.js" />
      <Script src="/plugins/jqvmap/jquery.vmap.min.js" />
      <Script src="/plugins/jqvmap/maps/jquery.vmap.usa.js" />
      <Script src="/plugins/jquery-knob/jquery.knob.min.js" />
      <Script src="/plugins/bootstrap/js/bootstrap.bundle.min.js" />
      <Script src="/plugins/chart.js/Chart.min.js" />
      <Script src="/plugins/sparklines/sparkline.js" />
      <Script src="/plugins/moment/moment.min.js" />
      <Script src="/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js" />
      <Script src="/plugins/daterangepicker/daterangepicker.js" />
      <Script src="/plugins/summernote/summernote-bs4.min.js" />
      <Script src="/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js" />
      <Script src="/dist/js/adminlte.js" />
    </div>
  );
}
