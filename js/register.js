document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Ngăn chặn reload trang

        // Lấy dữ liệu từ input
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const dob = document.getElementById("dob").value;

        // const dobObject = new Date(dob);
        // dob=dobObject;

        // Format lại dob thành yyyy/mm/dd
        // const formattedDob = `${dob.getFullYear()}/${(dob.getMonth() + 1).toString().padStart(2, "0")}/${dob.getDate().toString().padStart(2, "0")}`;
    
        
        if (!username || !password || !firstName || !lastName || !email || !dob) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/identity/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, firstName, lastName, email, dob })
            });
            

            const data = await response.json(); // Nhận phản hồi từ server

            if (response.ok) {
                alert("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
                window.location.href = "inout.html";
            } else {
                alert(data.message || "Có lỗi xảy ra!");
            }
        } catch (error) {
            alert("Lỗi kết nối đến server!");
            console.error("Lỗi:", error);
        }
    });
});
