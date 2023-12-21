//verificar si todos los campos están completos
function verificarCamposCompletos(divId, siguiente) {
    var formularioCompleto = true;
    // Iterar a través de los elementos del formulario
    $("#" + divId + " input[required]").each(function() {
      // Verificar si el campo está vacío
      if ($(this).val() === '') {
        formularioCompleto = false;
        return false; // Romper el bucle si se encuentra un campo vacío
      }
});

siguiente.prop('disabled', !formularioCompleto); //si no esta completo deshabilita el botón

}
