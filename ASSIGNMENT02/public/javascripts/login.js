document.getElementById("togglePassword").addEventListener("click", function () {
    var passwordField = document.getElementById("password");
    var eyeIcon = document.getElementById("eyeIcon");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "https://img.icons8.com/ios-filled/50/hide.png"; // Ícono de "ocultar"
        eyeIcon.alt = "Hide Password";
    } else {
        passwordField.type = "password";
        eyeIcon.src = "https://img.icons8.com/ios/50/visible--v1.png"; // Ícono de "mostrar"
        eyeIcon.alt = "Show Password";
    }
});