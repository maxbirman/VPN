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

function alertCharLimit(input){
    if(input.attr('maxlength') !== undefined) {
        var valor = input.val();
        var maxLength = input.attr('maxlength');

        if(valor.length == maxLength) {
            alert("El nombre de la VPN no puede tener más de 15 caracteres");        
            input.val(valor.substring(0, maxLength-1));        
        }

        else {input.removeAttr("style");}
    }
}

