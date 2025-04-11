document.addEventListener("DOMContentLoaded", function () {
    const rutInput = document.getElementById("rut");
    const form = document.getElementById("userProfileForm");

    const rutRegex = /^[0-9]{1,8}-[0-9kK]$/;

    // Normaliza el RUT eliminando puntos y convirtiendo "K" a minúsculas
    function normalizeRut(rut) {
        return rut.replace(/\./g, "").toLowerCase();
    }

    // Muestra el mensaje de error
    function showError(input, errorElement, message) {
        input.style.borderColor = "red"; // Cambia el borde del input
        errorElement.textContent = message; // Muestra el mensaje de error
        errorElement.classList.add("visible"); // Añade la clase para hacer visible el error
    }

    // Limpia el mensaje de error
    function clearError(input, errorElement) {
        input.style.borderColor = ""; // Restablece el borde del input
        errorElement.textContent = ""; // Limpia el mensaje de error
        errorElement.classList.remove("visible"); // Quita la clase para ocultar el error
    }

    // Valida el RUT
    function validateRut() {
        const rutError = document.getElementById("rutError");
        const normalizedRut = normalizeRut(rutInput.value); // Normaliza el valor ingresado

        if (!rutRegex.test(normalizedRut)) {
            showError(rutInput, rutError, "Por favor ingresa un RUT válido con o sin puntos (Ej: 19.208.330-3 o 19208330-3).");
            return false; // Indica que la validación falló
        } else {
            clearError(rutInput, rutError);
            return true; // Indica que el RUT es válido
        }
    }

    // Validación en tiempo real mientras el usuario escribe
    rutInput.addEventListener("input", validateRut);

    // Bloqueo del envío del formulario si el RUT no es válido
    form.addEventListener("submit", function (event) {
        const isRutValid = validateRut();
        if (!isRutValid) {
            alert("Por favor, corrige los errores antes de enviar el formulario.");
            event.preventDefault(); // Bloquea el envío del formulario
        }
    });
});
