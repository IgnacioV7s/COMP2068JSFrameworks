document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita el envío inmediato del formulario

        // Se añade el trim() para eliminar espacios en blanco al inicio y al final de los campos
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Validar que el nombre contenga al menos dos palabras (nombre y apellido)
        const nameParts = username.split(" ");
        if (nameParts.length < 2) {
            alert("Debes ingresar tu nombre y apellido.");
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            alert("Correo electrónico no válido.");
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Si pasa todas las validaciones, enviar el formulario
        form.submit();
    });
});
