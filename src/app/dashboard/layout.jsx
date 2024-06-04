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
      <Script src="/plugins/jquery/jquery.min.js"></Script>
      <Script src="/plugins/jquery-ui/jquery-ui.min.js"></Script>
      <Script src="/plugins/jqvmap/jquery.vmap.min.js"></Script>
      <Script src="/plugins/jqvmap/maps/jquery.vmap.usa.js"></Script>
      <Script src="/plugins/jquery-knob/jquery.knob.min.js"></Script>
      <Script src="/plugins/bootstrap/js/bootstrap.bundle.min.js"></Script>
      <Script src="/plugins/chart.js/Chart.min.js"></Script>
      <Script src="/plugins/sparklines/sparkline.js"></Script>
      <Script src="/plugins/moment/moment.min.js"></Script> {/* โหลด moment.js ก่อน */}
      <Script src="/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></Script> {/* โหลด tempusdominus-bootstrap-4.js หลัง */}
      <Script src="/plugins/daterangepicker/daterangepicker.js"></Script>
      <Script src="/plugins/summernote/summernote-bs4.min.js"></Script>
      <Script src="/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></Script>
      <Script src="/dist/js/adminlte.js"></Script>
    </div>
  );
}
