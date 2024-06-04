"use client"

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import MyModal from "./components/MyModal.jsx";
import dayjs from "dayjs";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [recordInCarts, setRecordInCarts] = useState(0);
  const [sumQty, setSumQty] = useState(0);
  const [sumPrice, setSumPrice] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [payDate, setPayDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [payTime, setPayTime] = useState("");

  useEffect(() => {
    fetchProductData();
    fetchDataFromLocal();
  }, []);

  const fetchProductData = async () => {
    try {
      const res = await axios.get("/api/product/list");
      if (res.data.results !== undefined) {
        setProducts(res.data.results);
      }
    } catch (err) {
      Swal.fire({
        title: "error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const showImage = (item) => {
    let imgPath = "/default-image.png"; // default path
    if (item.image) {
      imgPath = "/uploads/" + item.image;
    }
    return <img className="card-img-top" height="250px" src={imgPath} alt="" />;
  };

  const addToCart = (item) => {
    let arr = [...carts];
    arr.push(item);
    setCarts(arr);
    setRecordInCarts(arr.length);
    localStorage.setItem("carts", JSON.stringify(arr));
    fetchDataFromLocal();
  };

  const fetchDataFromLocal = () => {
    const itemInCarts = JSON.parse(localStorage.getItem("carts"));
    if (itemInCarts !== null) {
      setCarts(itemInCarts);
      setRecordInCarts(itemInCarts.length);
      computePriceAndQty(itemInCarts);
    }
  };

  const computePriceAndQty = (itemInCarts) => {
    let sumQty = 0;
    let sumPrice = 0;
    for (let i = 0; i < itemInCarts.length; i++) {
      const item = itemInCarts[i];
      sumQty++;
      sumPrice += parseInt(item.price);
    }
    setSumPrice(sumPrice);
    setSumQty(sumQty);
  };

  const handleRemove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "ลบสินค้า",
        text: "คุณต้องการลบสินค้าในตะกร้าใช่ไหม?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "No, cancel!",
      });

      if (button.isConfirmed) {
        let arr = carts.filter((cartItem) => cartItem.id !== item.id);
        setCarts(arr);
        setRecordInCarts(arr.length);
        localStorage.setItem("carts", JSON.stringify(arr));
        computePriceAndQty(arr);
      }
    } catch (err) {
      Swal.fire({
        title: "error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const handleSave = async () => {
    try {
      // ตรวจสอบข้อมูลก่อนส่ง
      if (!customerName || !customerPhone || !customerAddress || !payDate || !payTime) {
        Swal.fire({
          title: "error",
          text: "กรุณากรอกข้อมูลให้ครบถ้วน",
          icon: "error",
        });
        return;
      }

      const payload = {
        customerName,
        customerPhone,
        customerAddress,
        payDate,
        payTime,
        carts,
      };
      const res = await axios.post("/api/sale/save", payload);

      if (res.data.message === "success") {
        localStorage.removeItem("carts");
        setRecordInCarts(0);
        setCarts([]);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setPayTime("");
        setSumQty(0);
        setSumPrice(0);

        Swal.fire({
          title: "บันทึกข้อมูล",
          text: "ระบบได้บันทึกข้อมูลของคุณแล้ว",
          icon: "success",
        });
        document.getElementById("modalCart_btnClose").click();
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setPayDate(dayjs(new Date()).format("YYYY-MM-DD"));
        setPayTime("");
      }
    } catch (err) {
      Swal.fire({
        title: "error",
        text: err.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="h3">สินค้าของร้านเรา</div>
          <div>
            ตะกร้าของฉัน
            <button className="btn btn-outline-success ms-2" data-bs-toggle="modal" data-bs-target="#modalCart">
              <i className="fa fa-shopping-cart me-2"></i>
              {recordInCarts}
            </button>
          </div>
        </div>

        <div className="row">
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
                <div className="card h-100">
                  {showImage(item)}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.price.toLocaleString("th-TH")} บาท</p>
                    <button className="btn btn-primary mt-auto" onClick={() => addToCart(item)}>
                      <i className="fa fa-shopping-cart me-2"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>ไม่มีสินค้าในตอนนี้</div>
          )}
        </div>
      </div>

      <MyModal id="modalCart" title="ตะกร้าสินค้าของฉัน">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>name</th>
              <th className="text-end">price</th>
              <th className="text-end">qty</th>
              <th width="60px"></th>
            </tr>
          </thead>
          <tbody>
            {carts.length > 0 ? (
              carts.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td className="text-end">{item.price.toLocaleString("th-TH")}</td>
                  <td className="text-end">1</td>
                  <td className="text-center">
                    <button className="btn btn-danger" onClick={() => handleRemove(item)}>
                      <i className="fa fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  ไม่มีสินค้าในตะกร้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-center">
          จำนวน {sumQty} รายการ เป็นเงิน {sumPrice.toLocaleString("th-TH")} บาท
        </div>

        <div className="mt-3">
          <div className="form-group">
            <label htmlFor="buyerName">ชื่อผู้ซื้อ</label>
            <input
              id="buyerName"
              className="form-control"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="buyerPhone">เบอร์โทรติดต่อ</label>
            <input
              id="buyerPhone"
              className="form-control"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="buyerAddress">ที่อยู่จัดส่ง</label>
            <textarea
              id="buyerAddress"
              className="form-control"
              rows="3"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group mt-3">
            <label htmlFor="paymentDate">วันที่โอน</label>
            <input
              className="form-control"
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="paymentTime">เวลาที่โอนเงิน</label>
            <input
              id="paymentTime"
              className="form-control"
              value={payTime}
              onChange={(e) => setPayTime(e.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-3 w-100" onClick={handleSave}>
            <i className="fa fa-check me-2"></i>ยืนยันการซื้อ
          </button>
        </div>
      </MyModal>
    </>
  );
}
