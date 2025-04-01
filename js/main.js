// open/close icon-user
// document.addEventListener("DOMContentLoaded", function () {
//     const userMenu = document.querySelector(".user-menu");
//     const userBtn = document.querySelector(".user-btn");

//     userBtn.addEventListener("click", function () {
//         userMenu.classList.toggle("active");
//     });

//     // Đóng subnav khi click ra ngoài
//     document.addEventListener("click", function (event) {
//         if (!userMenu.contains(event.target)) {
//             userMenu.classList.remove("active");
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", function () {
    const userMenu = document.querySelector(".user-menu");
    const userBtn = document.querySelector(".user-btn");
    const logoutBtn = document.getElementById("logout-btn") // Chọn nút đăng xuất

    userBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        userMenu.classList.toggle("active");
    });

    // Đóng subnav khi click ra ngoài nhưng không đóng nếu click vào nút đăng xuất
    document.addEventListener("click", function (event) {
        if (!userMenu.contains(event.target) && event.target !== userBtn) {
            userMenu.classList.remove("active");
        }
    });

    // Xử lý sự kiện đăng xuất
    // logoutBtn.addEventListener("click", function (event) {
    //     event.stopPropagation(); // Ngăn chặn đóng menu ngay lập tức
    //     // console.log("Đã đăng xuất!"); 
    //     // Thay bằng logic đăng xuất thực tế
    // });
});

// nhan du lieu hien thi thong tin user
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    fetch("http://localhost:8080/identity/myInfo", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, // Gửi token trong header
            "Content-Type": "application/json"
        }})
    .then(response => response.json())
    .then(data => {
        if (data.code === 1000 && data.result) {
            const user = data.result;
            
            // Cập nhật thông tin lên giao diện
            document.getElementById("user-name").textContent = user.username;
            document.getElementById("full-name").textContent = user.firstName + " " + user.lastName;
            document.getElementById("user-email").textContent = user.email;
            // console.log(user.email);
            document.getElementById("user-dob").textContent = user.dob;
        } else {
            console.error("Không thể lấy dữ liệu người dùng");
        }
    })
    .catch(error => console.error("Lỗi kết nối:", error));

    // Xử lý đăng xuất
    document.getElementById("logoutv2").addEventListener("click", function (event) {
        // event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
        console.log("🔵 Sự kiện click hoạt động!"); // Debug
    
        const token = localStorage.getItem("token");
        console.log("📌 Token hiện tại:", token); // Debug
    
        if (!token) {
            alert("Không tìm thấy token!");
            return;
        }
    
        fetch("http://localhost:8080/identity/auth/logout", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token })
        })
        .then(response => {
            console.log("🔵 Phản hồi từ server:", response); // Debug
            return response.json();
        })
        .then(data => {
            console.log("📌 Dữ liệu trả về từ server:", data); // Debug
    
            if (data.code === 1000) {
                // alert("Đã đăng xuất!");
                localStorage.removeItem("token");
                console.log("✅ Token đã bị xóa khỏi localStorage."); // Debug
                window.location.href = "./pages/inout.html";
            } else {
                alert("Lỗi đăng xuất: " + data.message);
            }
        })
        .catch(error => console.error("❌ Lỗi khi đăng xuất:", error));
    });
});



// thêm sản phẩm vào giỏ hàng
const cart = []; // Mảng chứa sản phẩm trong giỏ hàng

// Lấy danh sách tất cả các nút "Thêm vào giỏ hàng"
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (event) => {
        // alert("Add to cart");
        const productElement = event.target.closest(".product");

        // Lấy thông tin sản phẩm từ data attributes
        const product = {
            // id: productElement.getAttribute("data-id"),
            name: productElement.getAttribute("name"),
            price: parseInt(productElement.getAttribute("price")),
            unit: productElement.getAttribute("unit"),
            quantity: 1 // Mặc định số lượng là 1
        };

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity++; // Nếu có, tăng số lượng
        } else {
            cart.push(product); // Nếu chưa có, thêm vào mảng cart
        }

        updateCartUI(); // Cập nhật giao diện giỏ hàng
    });
});

// Cập nhật giao diện giỏ hàng
const cartList = document.getElementById("cart-list");
const listpay = document.getElementById("listpay");
const totalmoney = document.getElementById("totalmoney");
function updateCartUI() {
    cartList.innerHTML = ""; // Xóa danh sách cũ
    listpay.innerHTML = ""; // Xóa danh sách cũ
    totalmoney.innerHTML = ""; // Xóa danh sách cũ
    
    let totalItems = 0; // Biến đếm tổng số mặt hàng
    let totalPrice = 0; // Biến đếm t��ng tiền
    cart.forEach(product => {
        totalItems += product.quantity; // Cộng dồn số lượng sản phẩm
        const li = document.createElement("li");
        li.textContent = `${product.name} - ${product.quantity} ${product.unit} - ${product.price * product.quantity} VND`;
        totalPrice += product.price * product.quantity;
        cartList.appendChild(li);
        const liClone = li.cloneNode(true); // Tạo bản sao của <li>
        listpay.appendChild(liClone);
    });
    document.querySelectorAll(".cart-count").forEach( x => {
        x.textContent = totalItems;
    } );
    totalmoney.textContent = totalPrice; // Hiển thị t��ng tiền
}

// thêm sản phẩm thành công
// Hàm hiển thị thông báo
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMessage = toast.querySelector(".toast-message");
    toastMessage.innerText = message; // Cập nhật nội dung message
    toast.classList.add('show');
  
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // Gắn sự kiện cho nút (ví dụ)
  document.querySelectorAll('.add-to-cart').forEach(e=>{
     e.addEventListener('click', function(e) {
      e.preventDefault();
      showToast("Đã thêm vào giỏ hàng!");
    });
  });



// module thanh toán 
  // Lấy các phần tử DOM cần thiết
const openPaymentBtn = document.getElementById('openPaymentBtn');
const paymentModal = document.getElementById('paymentModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const paymentForm = document.getElementById('paymentForm');
const payButton = document.getElementById('payButton');

// Mở modal thanh toán khi nhấn nút "Thanh toán"
openPaymentBtn.addEventListener('click', () => {
  paymentModal.classList.remove('hidden');
});

// Đóng modal khi nhấn nút "×"
closeModalBtn.addEventListener('click', () => {
  paymentModal.classList.add('hidden');
  resetForm();
});


document.getElementById("paymentMethod").addEventListener("change", function () {
    const qrCode = document.getElementById("image-qr");
    if (this.value === "card") {
        qrCode.style.display = "block";  // Hiển thị mã QR
    } else {
        qrCode.style.display = "none";   // Ẩn mã QR
    }
});

document.getElementById("btn-pay1").addEventListener("click", function () {
    showToast("Đơn hàng sẽ sớm được xử lý!"); // Hiển thị thông báo

    // Ẩn modal
    
    document.getElementById("paymentModal").style.display = "none";
    // cập nhập giỏ hàng
    
        // const cartList = document.getElementById("cart-list");
        // const listpay = document.getElementById("listpay");
        // const totalmoney = document.getElementById("totalmoney");
        cartList.innerHTML = ""; // Xóa danh sách cũ
        listpay.innerHTML = ""; // Xóa danh sách cũ
        totalmoney.innerHTML = ""; // Xóa danh sách cũ
        
        let totalItems = 0; // Biến đếm tổng số mặt hàng
        let totalPrice = 0; // Biến đếm t��ng tiền
        
        document.querySelectorAll(".cart-count").forEach( x => {
            x.textContent = totalItems;
        } );
        totalmoney.textContent = totalPrice; // Hiển thị t��ng tiền
    
});



// giao diện quản lí 

function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("Không tìm thấy token!");
        return null;
    }

    // Giải mã token (JWT được mã hóa theo Base64)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        console.log("Token không hợp lệ!");
        return null;
    }

    // Chuyển phần payload từ Base64 thành JSON
    const payload = JSON.parse(atob(tokenParts[1]));
    if (payload.scope && payload.scope.includes("ROLE_ADMIN")) {
        document.getElementById("addBtn").style.display = "inline-block";
        document.getElementById("editBtn").style.display = "inline-block";
        document.getElementById("deleteBtn").style.display = "inline-block";
    }
    // console.log("Thông tin user:", payload);

    return payload.scope; // Hoặc payload.role tùy theo cách backend định nghĩa
}

// Gọi hàm để lấy vai trò của user
const userRole = getUserRole();
// console.log("User Role:", userRole);

// thêm sản phẩm 
// document.getElementById("addBtn").addEventListener("click", function () {
//     // Lấy dữ liệu từ input
//     const product1 = document.getElementById("1");
//     if (product1) {
//         const hasNameAttribute = product1.hasAttribute('name');
//         const hasPriceAttribute = product1.hasAttribute('price');
//         const hasUnitAttribute = product1.hasAttribute('unit');
//         const hasImagesAttribute = product1.hasAttribute('images');
//         const hasCategoryIdAttribute = product1.hasAttribute('categoryId');
        
        
        
//         // Nếu muốn lấy giá trị của các thuộc tính
//         if (hasNameAttribute) {
//           const nameValue = product1.getAttribute('name');
//           console.log('Giá trị name:', nameValue);
//         }
        
//         if (hasPriceAttribute) {
//           const priceValue = product1.getAttribute('price');
//           console.log('Giá trị price:', priceValue);
//         }
        
//         if (hasUnitAttribute) {
//           const unitValue = product1.getAttribute('unit');
//           console.log('Giá trị unit:', unitValue);
//         }
//         if (hasImagesAttribute) {
//           const imagesValue = product1.getAttribute('images');
//           console.log('Giá trị images:', imagesValue);
//         }
//         if (hasCategoryIdAttribute) {
//           const categoryIdValue = product1.getAttribute('categoryId');
//           console.log('Giá trị categoryId:', categoryIdValue);
//         }
//         const nameValue = product1.getAttribute('name');
//         const priceValue = product1.getAttribute('price');
//         const unitValue = product1.getAttribute('unit');
//         const imagesValue = product1.getAttribute('images');
//         const categoryIdValue = product1.getAttribute('categoryId');

//         const token = localStorage.getItem("token");
//         if (!token) {
//             alert("Bạn chưa đăng nhập!");
//             return;
//         }
//         const formData = new FormData();
//         formData.append("name",nameValue );
//         formData.append("price", priceValue);
//         formData.append("unit", unitValue);
//         formData.append("image", blob, "banner-image-6.jpg"); // Đặt tên file
//         formData.append("categoryId",categoryIdValue );
//         try {
//             const res = await fetch("http://localhost:8080/identity/products/products", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 },
//                 body: formData
//             });
    
//             const result = await res.json();
//             console.log("Upload thành công:", result);
//         } catch (error) {
//             console.error("Lỗi upload:", error);
//         }
//       } else {
//         console.log('Không tìm thấy phần tử');
//       }
    
// });

/////////
// document.getElementById("addBtn").addEventListener("click", async function () {
//     // Lấy dữ liệu từ input
//     const product1 = document.getElementById("1");
//     if (product1) {
//         // Lấy các thuộc tính từ element
//         const nameValue = product1.getAttribute('name');
//         const priceValue = product1.getAttribute('price');
//         const unitValue = product1.getAttribute('unit');
//         // const imagesValue = product1.getAttribute('images');
//         const categoryIdValue = product1.getAttribute('categoryId');

//         console.log('Giá trị name:', nameValue);
//         console.log('Giá trị price:', priceValue);
//         console.log('Giá trị unit:', unitValue);
//         // console.log('Giá trị images:', imagesValue);
//         console.log('Giá trị categoryId:', categoryIdValue);

//         const token = localStorage.getItem("token");
//         if (!token) {
//             alert("Bạn chưa đăng nhập!");
//             return;
//         }
//         const img = document.getElementById("image-1"); 
//         const base64 = img.src; // Lấy src (Base64)
//         const blob = base64ToBlob(base64, "image/png"); // Chuyển Base64 thành Blob
//         const formData = new FormData();
//         formData.append("name", nameValue);
//         formData.append("price", priceValue);
//         formData.append("unit", unitValue);
//         // Lưu ý: Biến blob phải được định nghĩa hoặc lấy từ đâu đó (ví dụ: từ một thẻ <img> hoặc input file)
//         formData.append("image", blob, "banner-image-6.jpg");
//         formData.append("categoryId", categoryIdValue);

//         try {
//             const res = await fetch("http://localhost:8080/identity/products/products", {
//                 method: "POST",
//                 // Với FormData, không cần đặt header "Content-Type" vì browser tự set
//                 headers: {
//                     "Authorization": `Bearer ${token}`
//                 },
//                 body: formData
//             });
    
//             const result = await res.json();
//             console.log("Upload thành công:", result);
//         } catch (error) {
//             console.error("Lỗi upload:", error);
//         }
//     } else {
//         console.log('Không tìm thấy phần tử');
//     }
// });


/////

// 
////



// upload.js

// Sự kiện click cho nút "addBtn"
document.getElementById("addBtn").addEventListener("click", async function () {
    // Lấy element chứa thông tin sản phẩm (giả sử có id "1")
    const product1 = document.getElementById("1");
    if (!product1) {
      console.log('Không tìm thấy phần tử chứa thông tin sản phẩm');
      return;
    }
  
    // Lấy các thuộc tính từ element
    const nameValue = product1.getAttribute('name');
    const priceValue = product1.getAttribute('price');
    const unitValue = product1.getAttribute('unit');
    const categoryIdValue = product1.getAttribute('categoryId');
  
    console.log('Giá trị name:', nameValue);
    console.log('Giá trị price:', priceValue);
    console.log('Giá trị unit:', unitValue);
    console.log('Giá trị categoryId:', categoryIdValue);
  
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
  
    // Lấy ảnh từ thẻ <img id="image-1">
    const img = document.getElementById("image-1");
    if (!img) {
      console.error("Không tìm thấy thẻ ảnh có id 'image-1'");
      return;
    }
    
    try {
      // Dùng fetch để lấy Blob từ URL của ảnh
      const response = await fetch(img.src);
      if (!response.ok) {
        throw new Error("Không thể tải ảnh từ URL");
      }
      const blob = await response.blob();
  
      // Tạo FormData và append dữ liệu sản phẩm
      const formData = new FormData();
      formData.append("name", nameValue);
      formData.append("price", priceValue);
      formData.append("unit", unitValue);
      formData.append("image", blob, "banner-image-6.jpg"); 
      // Đặt tên file tùy ý
      formData.append("categoryId", categoryIdValue);
  
      // Gửi POST request đến server
      const res = await fetch("http://localhost:8080/identity/products/products", {
        method: "POST",
        // Không đặt "Content-Type" khi dùng FormData, browser tự xử lý
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
  
      const result = await res.json();
      console.log("Upload thành công:", result);
    } catch (error) {
      console.error("Lỗi upload:", error);
    }
  });
  