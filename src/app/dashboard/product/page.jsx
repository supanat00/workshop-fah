"use client";

import MyModal from "../components/MyModal";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [productTrash, setProductTrash] = useState({});
  const [selectedTrashItems, setSelectedTrashItems] = useState([]);
  const { data: session } = useSession();
  const fileInputRef = useRef();

  useEffect(() => {
    fetchProductData();
    fetchProductDelete();
  }, []);

  const fetchProductData = async () => {
    try {
      const res = await axios.get("/api/product/list", {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.results !== undefined) {
        setProducts(res.data.results);
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const handleSave = async () => {
    if (session) {
      try {
        const productData = { ...product };
        console.log(image);
        if (image) {
          const uploadedImageName = await handleUpload();
          if (uploadedImageName) {
            productData.image = uploadedImageName;

          } else {
            throw new Error("Image upload failed");
          }
        }

        productData.cost = parseInt(product.cost);
        productData.price = parseInt(product.price);

        let res;
        if (product.id === undefined) {
          res = await axios.post("/api/product/create", productData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          res = await axios.put("/api/product/update", productData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        if (res.data.message === "success") {
          Swal.fire({
            title: "Save",
            text: "Success",
            icon: "success",
            timer: 1000,
          });
          document.getElementById("modalProduct_btnClose").click();
          clearForm();
          fetchProductData();
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.message,
          icon: "error",
        });
      }
    }
  };

  const handleRemove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "Remove",
        text: "Are you sure you want to remove this item?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "No, cancel!",
      });

      if (button.isConfirmed) {
        const res = await axios.delete(`/api/product/remove/${item.id}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (res.data.message === "success") {
          Swal.fire({
            title: "Removed",
            text: "Item has been removed successfully",
            icon: "success",
            timer: 1000,
          });

          fetchProductData();
          fetchProductDelete();
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const clearForm = () => {
    setProduct({
      name: "",
      cost: "",
      price: "",
    });
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectedFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post("/api/product/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.newName !== undefined) {
        return res.data.newName;
      } else {
        throw new Error("Failed to get uploaded image name");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
      return "";
    }
  };

  const showImage = (item) => {
    if (item.image && item.image !== "") {
      return (
        <img
          alt=""
          className="img-fluid"
          width="150px"
          src={"/uploads/" + item.image}
        />
      );
    }
  };

  const fetchProductDelete = async () => {
    try {
      const res = await axios.get("/api/product/listdelete", {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.results !== undefined) {
        setProductTrash(res.data.results);
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const handleTrashCheckboxChange = (itemId) => {
    setSelectedTrashItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
  };

  const handleRestore = async (item) => {
    try {
      const button = await Swal.fire({
        title: "Restore",
        text: "Are you sure you want to restore this item?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, restore it!",
        cancelButtonText: "No, cancel!",
      });

      if (button.isConfirmed) {
        if (selectedTrashItems.length === 0) {
          // Restore the single item clicked
          const res = await axios.put(`/api/product/restore/${item.id}`, {
            headers: { "Content-Type": "application/json" },
          });

          if (res.data.message === "success") {
            Swal.fire({
              title: "Restored",
              text: "Item has been restored successfully",
              icon: "success",
              timer: 1000,
            });

            fetchProductData();
            fetchProductDelete();
          }
        } else {
          // Restore selected items
          for (const itemId of selectedTrashItems) {
            const res = await axios.put(`/api/product/restore/${itemId}`, {
              headers: { "Content-Type": "application/json" },
            });

            if (res.data.message === "success") {
              Swal.fire({
                title: "Restored",
                text: "Item has been restored successfully",
                icon: "success",
                timer: 1000,
              });
            }
          }

          fetchProductData();
          fetchProductDelete();
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    }
  };

  const handleCloseModal = () => {
    document.getElementById("modalTrash_btnClose").click();
  };

  const handleRemoveReal = async (item) => {
    try {
      const button = await Swal.fire({
        title: "Permanent Delete",
        text: "Are you sure you want to permanently delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (button.isConfirmed) {
        if (selectedTrashItems.length === 0) {
          const res = await axios.delete(`/api/product/removeReal/${item.id}`, {
            headers: { "Content-Type": "application/json" },
          });

          if (res.data.message === "success") {
            Swal.fire({
              title: "ลบสำเร็จ",
              text: "ลบสินค้าเรียบร้อย",
              icon: "success",
              timer: 1000,
            });

            fetchProductDelete();
          }
        } else {
          for (const itemId of selectedTrashItems) {
            const res = await axios.delete(
              `/api/product/removeReal/${itemId}`,
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            if (res.data.message === "success") {
              Swal.fire({
                title: "ลบสำเร็จ",
                text: "ลบสินค้าเรียบร้อย",
                icon: "success",
                timer: 1000,
              });

              fetchProductDelete();
            }
          }
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="h4">Product</div>
      <div className="d-flex flex-wrap mb-3">
        <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#modalProduct"
          onClick={clearForm}
        >
          <i className="fa fa-plus mr-2"></i>เพิ่มรายการ
        </button>

        <button
          className="btn btn-outline-danger ml-2"
          data-toggle="modal"
          data-target="#modalTrash"
        >
          <i className="fa fa-trash mr-2" aria-hidden="true"></i>
          ถังขยะ ({productTrash.length})
        </button>
      </div>

      <table className="table table-hover table-bordered">
        <thead className="bg-gray">
          <tr>
            <th scope="col">ภาพสินค้า</th>
            <th scope="col">name</th>
            <th scope="col">cost</th>
            <th scope="col">price</th>
            <th width="140px"></th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id}>
                <td>{showImage(item)}</td>
                <td>{item.name}</td>
                <td>{item.cost}</td>
                <td>{item.price}</td>
                <td className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary flex-fill mr-1"
                    data-toggle="modal"
                    data-target="#modalProduct"
                    onClick={() => setProduct(item)}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-danger flex-fill ml-1"
                    onClick={() => handleRemove(item)}
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      <MyModal id="modalProduct" title="สินค้า">
        <div className="form-group">
          <div>ชื่อสินค้า</div>
          <input
            type="text"
            className="form-control"
            value={product.name || ""}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <div>ราคาทุน</div>
          <input
            type="number"
            className="form-control"
            value={product.cost || ""}
            onChange={(e) => setProduct({ ...product, cost: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <div>ราคาขาย</div>
          <input
            type="number"
            className="form-control"
            value={product.price || ""}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <div className="mb-3">
            {imagePreview ? (
              <img
                alt=""
                className="img-fluid"
                width="150px"
                src={imagePreview}
              />
            ) : (
              showImage(product)
            )}
          </div>
          <div>ภาพสินค้า</div>
          <input
            type="file"
            className="form-control"
            onChange={selectedFile}
            ref={fileInputRef}
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            <i className="fa fa-check mr-2"></i>Save
          </button>
        </div>
      </MyModal>

      <MyModal id="modalTrash" title="ถังขยะ">
        <div className="modal-body">
          <table className="table table-hover table-bordered">
            <thead className="thead-light">
              <tr>
                <th width="5%">
                  <input
                    type="checkbox"
                    checked={selectedTrashItems.length === productTrash.length}
                    onChange={() => {
                      setSelectedTrashItems(
                        selectedTrashItems.length === productTrash.length
                          ? []
                          : productTrash.map((item) => item.id)
                      );
                    }}
                  />
                </th>
                <th width="15%">Photo</th>
                <th>Name</th>
                <th className="text-right">Cost</th>
                <th className="text-right">Price</th>
                <th width="10%">Restore</th>
                <th width="10%">Delete</th>
              </tr>
            </thead>
            <tbody>
              {productTrash.length > 0 ? (
                productTrash.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTrashItems.includes(item.id)}
                        onChange={() => handleTrashCheckboxChange(item.id)}
                      />
                    </td>
                    <td>{showImage(item)}</td>
                    <td>{item.name}</td>
                    <td className="text-right">
                      {item.cost.toLocaleString("th-TH")}
                    </td>
                    <td className="text-right">
                      {item.price.toLocaleString("th-TH")}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleRestore(item)}
                      >
                        <i className="fa fa-undo" aria-hidden="true"></i>
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveReal(item)}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    ไม่มีสินค้าในตะกร้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary w-100" onClick={handleCloseModal}>
            <i className="fa fa-check mr-2"></i>เสร็จสิ้น
          </button>
        </div>
      </MyModal>
    </>
  );
}
