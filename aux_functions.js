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
//function para alertar que el nombre de la vpn no puede tener mas de 15 caracteres
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

function nextPanel(current, next) {

    var currentPanel = $("#" + current);
    var nextPanel = $("#" + next);
    var previousButton = $("#anterior");
    var nextButton = $("#siguiente");

    currentPanel.attr("style","display:none");
    nextPanel.removeAttr("style");
    if (current == "contacto") {previousButton.removeAttr("style");}
    nextButton.attr('disabled', 'disabled');
    nextButton.attr("data-message", next);    	
    previousButton.attr("data-message", next)
    verificarCamposCompletos(next, nextButton);
    //cargarDatos(current);
}
//verificar si el formato de la IP es correcto
function ipPublicaCorrecta (ip) {
    var correcto = false;
    if(publicIpRegex.test(ip)) {correcto = true;}

    return correcto;
}	

//verificar si la IP es publica
function ipCorrecta (ip) {
    var correcto = false;
    if(ipRegex.test(ip)) {correcto = true;}

    return correcto;
}	

function emailCorrecto(email) {
    return emailRegex.test(email);    
}

function getOptionsFromArray (data, selected){
    var options = "";
    var filas = data.split("\n");

    for (var i = 0; i < filas.length; i ++) {
        var listaInterface = filas[i].split(";");
        
        if(listaInterface[0] == selected){
            //se saltea 0 y 1 porque corresponden al modelo del Equipo
            for (var j = 2; j < listaInterface.length; j ++){
                if(j== (listaInterface.length) - 1) {
                    options += listaInterface[j] + ";" + listaInterface[j];
                }else {
                    options += listaInterface[j] + ";" + listaInterface[j] + "\n";
                }
            }                            
        }                       
    }
    return options;
}

function getDH (data){
    var rows = data.split("\n");
    return rows[2].split(";");
}

function populateDH(dh, data){
        
    var col = `<div class="col-1" id="dhcol${value}"></div>`;

    for (var i = 0; i <= data.length; i ++) {     
        value = data[i];
        var check = `<input type=checkbox class="form-check-input" id = "${value}" value="${value}">${value}</input>`;
        alert(value);
        dh.append(col);
        var colId = $("#dhcol" + value);
        colId.append(check);
    }
}

//funcion para popular cualquier select
function populateSelect (select, data) {
    var options = data.split('\n');
    for (var i = 0; i < options.length; i++){
        var option = options[i].split(";");
        select.append('<option value="' + option[0] + '">' + option[1] + '</option>');
    }
}

//toma el contenido de un archivo de texto y devuelve un array
function getArrayFromFile(file, callback) {
    $.ajax({
        url: file,
        datatype: "text",
        success: function (data) {
            data.split('\n');
            callback(data);
        }
    });
}

function populateModels (){
    var select = $("#deviceModel");
    var file = "https://raw.githubusercontent.com/maxbirman/TESTGITHUB/main/interfaces.csv";
    var data = [];
    getArrayFromFile(file, function(extData) {
        data = extData;            
        populateSelect(select,data);
    });                   
  }

  function getAuth(data){

  }