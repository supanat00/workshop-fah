"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";
import MyModal from "../components/MyModal";

export default function Page() {
  const [billSales, setBillSales] = useState([]);
  const [billSaleDetails, setBillSaleDetails] = useState([])
  const [sumPrice, setSumPrice] = useState(0)

  useEffect(() => {
    fetchBillSaleData();
  }, []);

  const fetchBillSaleData = async () => {
    try {
      const res = await axios.get("/api/sale/list", {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.results !== undefined) {
        setBillSales(res.data.results);
      }
    } catch (err) {
      Swal.fire({
        title: "error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const openModalInfo = async (item) => {
    try {
        const res = await axios.get(`/api/sale/billInfo/${item.id}`, {
            headers: { "Content-Type": "application/json" }
        })

        if (res.data.results !== undefined) {
            setBillSaleDetails(res.data.results)

            let mySumPrice = 0

            for (let i = 0; i < res.data.results.length; i++) {
                mySumPrice += parseInt(res.data.results[i].price)
            }

            setSumPrice(mySumPrice)
        }

    } catch (err) {
        Swal.fire({
            title: 'error',
            text: err.message,
            icon: 'error'
        })
    }
  };

  const handlePay = async (item) => {
    try {
        const button = await Swal.fire({
            title: 'ยืนยันการชำระเงิน',
            text: 'คุณได้รับการชำระเงิน และตรวจสอบข้อมูลแล้ว',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ยืนยันการชำระเงิน'
        })

        if (button.isConfirmed) {
            const res = await axios.get(`/api/sale/statusToPay/${item.id}`, {
                headers: { "Content-Type": "application/json" }
            })

            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'บันทึกข้อมูลแล้ว',
                    icon: 'success',
                    timer: 1000
                })

                fetchBillSaleData()
            }
        }
    } catch (err) {
        Swal.fire({
            title: 'error',
            text: err.message,
            icon: 'error'
        })
    }
  }

  const handleSend = async (item) => {
    try {
        const button = await Swal.fire({
            title: 'ยืนยันการจัดส่งสินค้า',
            text: 'คุณต้องการบัยทึกว่าจัดส่งสินค้าแล้ว',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ยืนยันการจักส่ง'
        })

        if (button.isConfirmed) {
            const res = await axios.get(`/api/sale/statusToSend/${item.id}`, {
                headers: { "Content-Type": "application/json" }
            })

            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'บันทึกข้อมูลแล้ว',
                    icon: 'success',
                    timer: 1000
                })

                fetchBillSaleData()
            }
        }
    } catch (err) {
        Swal.fire({
            title: 'error',
            text: err.message,
            icon: 'error'
        })
    }
  }

  const handleCancel = async (item) => {
    try {
        const button = await Swal.fire({
            title: 'ยืนยันการยกเลิก',
            text: 'คุณต้องการยกเลิกรายการบิลนี้ทั้งหมด',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ยืนยันการยกเลิก'
        })

        if (button.isConfirmed) {
            const res = await axios.get(`/api/sale/statusToCancel/${item.id}`, {
                headers: { "Content-Type": "application/json" }
            })

            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'บันทึกข้อมูลแล้ว',
                    icon: 'success',
                    timer: 1000
                })

                fetchBillSaleData()
            }
        }
    } catch (err) {
        Swal.fire({
            title: 'error',
            text: err.message,
            icon: 'error'
        })
    }
  }
  
  const displayStatusText = (item) => {
    if (item.status === 'wait') { 
        return <div className="badge bg-dark">รอตรวจสอบ</div>
    } else if (item.status === 'pay') {
        return <div className="badge bg-success">ชำระแล้ว</div>
    } else if (item.status === 'send') {
        return <div className="badge bg-info">จัดส่งแล้ว</div>
    } else if (item.status === 'cancel') {
        return <div className="badge bg-danger">ยกเลิกแล้ว</div>
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">รายงานยอดขาย</div>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-hover">
          <thead className="bg-gray">
              <tr>
                <th>ลูกค้า</th>
                <th>เบอร์โทร</th>
                <th>ที่อยู่</th>
                <th>วันที่ชำระเงิน</th>
                <th>เวลา</th>
                <th>สถานะ</th>
                <th width="480px"></th>
              </tr>
            </thead>
            <tbody>
              {billSales.length > 0 ? (
                billSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.customerName}</td>
                    <td>{sale.customerPhone}</td>
                    <td>{sale.customerAddress}</td>
                    <td>{dayjs(sale.payDate).format("YYYY/MM/DD")}</td>
                    <td>{sale.payTime}</td>
                    <td>{displayStatusText(sale)}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-secondary mr-1"
                        data-toggle='modal'
                        data-target='#modalInfo'
                        onClick={e => openModalInfo(sale)}
                      >
                        <i className="fa fa-file-alt mr-2"></i>รายการ
                      </button>
                      <button className="btn btn-info mr-1" onClick={e => handlePay(sale)}>
                        <i className="fa fa-check mr-2"></i>ได้ชำระเงินแล้ว
                      </button>
                      <button className="btn btn-success mr-1" onClick={e => handleSend(sale)}>
                        <i className="fa fa-file mr-2"></i>จัดส่งแล้ว
                      </button>
                      <button className="btn btn-danger" onClick={e => handleCancel(sale)}>
                        <i className="fa fa-times mr-2"></i>ยกเลิก
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">ยังไม่มีการสั่งสินค้า</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MyModal id='modalInfo' title='รายการของบิล'>
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>รายการ</th>
                    <th className="text-right">ราคา</th>
                    <th className="text-right">จำนวน</th>
                </tr>
            </thead>
            <tbody>
                {billSaleDetails.length > 0 ? billSaleDetails.map(item =>
                    <tr key={item.id}>
                        <td>{item.Product.name}</td>
                        <td className="text-right">{parseInt(item.price).toLocaleString('th-TH')}</td>
                        <td className="text-right">1</td>
                    </tr>
                ) : <></>}
            </tbody>
        </table>

        <div className="text-center mt-3">
            ยอดรวม {sumPrice.toLocaleString("th-TH")} บาท
        </div>
      </MyModal>
    </>
  );
}
