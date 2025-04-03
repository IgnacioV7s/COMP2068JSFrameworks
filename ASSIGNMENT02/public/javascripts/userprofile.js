document.addEventListener("DOMContentLoaded", function () {
    const rut = document.getElementById("rut");
    const dob = document.getElementById("dob");

    // Si RUT o Fecha de Nacimiento están vacíos, bloquear acceso a otras secciones
    if (!rut.value || !dob.value) {
        alert("Debes completar tu RUT y Fecha de Nacimiento antes de acceder a otras secciones.");
        window.location.href = "/userprofile";
    }
});