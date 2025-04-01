




document.addEventListener("DOMContentLoaded", function () {
    // Lấy form đăng nhập
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn chặn reload trang

        // Lấy giá trị từ input
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
            return;
        }

        // Tạo object dữ liệu gửi đi
        const loginData = {
            username: username,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8080/identity/auth/log-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok) {
                // alert("Đăng nhập thành công!");
                // console.log("Response:", result);
                // Chuyển hướng sau khi đăng nhập thành công
                localStorage.setItem("token", result.result.token); // Nếu API trả về token
                window.location.href = "../index.html";
            } else {
                alert("Đăng nhập thất bại: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            alert("Lỗi kết nối đến server!");
        }
    });
});
// document.getElementById("logoutBtn").addEventListener("click", function () {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username");
//     alert("Đã đăng xuất!");
//     window.location.href = "pages/inout.html"; // Chuyển về trang đăng nhập
// });


// face vs gg 
// Khởi tạo Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);


firebase.initializeApp(firebaseConfig);
const googleProvider = new firebase.auth.GoogleAuthProvider();

function signInWithGoogle() {
    firebase.auth().signInWithPopup(googleProvider)
        .then((result) => {
            console.log("User Info:", result.user);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
const facebookProvider = new firebase.auth.FacebookAuthProvider();

function signInWithFacebook() {
    firebase.auth().signInWithPopup(facebookProvider)
        .then((result) => {
            console.log("User Info:", result.user);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
