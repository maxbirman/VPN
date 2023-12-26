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

function verificarSelect(divId, siguiente) {
    var formularioCompleto = true;
    // Iterar a través de los elementos del formulario
    $("#" + divId + " select[required]").each(function() {
      // Verificar si el campo está vacío
      if ($(this).val() == 'none') {
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
    cargarDatos(current);
}

function cargarDatos(panel){
    switch(panel){
        case "contacto": {
                info["referencia"] = $("#reference").val();
                info["nombre"] = $("#contactName").val();
                info["telefono"] = $("#phone").val();
                info["email"] = $("#email").val();
                break;                    
        }
        case "general": {
               phase1["nombreVPN"] = $("#vpnName").val();
                break;
        }
        case "network": {
                info["modelo"] = $("#deviceModel").val();
               phase1["interface"] = $("#interface").val();
               phase1["publicLocal"] = $("#publicLocal").val();
               phase1["publicRemote"] = $("#publicRemote").val();
               phase1["natTraversal"] = $("#natTraversal").val();
               phase1["keepalive"] = $("#keepAlive").val();
               phase1["dpd"] = $("#deadPeerDetection").val();
                break;                  
        }
        case "authentication": {
               phase1["authMethod"] = $("#authMethod").val();
               phase1["psk"] = $("#psk").val();
               phase1["ikeVersion"] = $("#ikeVersion").val();
               phase1["ikeMode"] = $("#ikeMode").val();
                break;
        }
        case "phase1Proposal" : {
               phase1["proposal"] = {0: $("#phase1Auth0").val() + "-" + $("#phase1Enc0").val(),
                                      1: $("#phase1Auth1").val() + "-" + $("#phase1Enc1").val(),
                                      2: $("#phase1Auth2").val() + "-" + $("#phase1Enc2").val()
                                    };
                var dhgrp;                    
                for (i = 0; i <= 31; i++) {
                    var dh = $("#p1dh" + i);
                    if (dh.length > 0 && dh.val() == "enable"){
                        dhgrp += dh + " ";
                    }
                }
                break;                                
            }
            case "phase2Proposal": {
                var nombreVPN = $("#nombreVPN").val();
                var dhgrp;
                var proposal = {0: $("#phase2Auth0").val() + "-" + $("#phase2Enc0").val() + " ",
                                1: $("#phase2Auth1").val() + "-" + $("#phase2Enc1").val() + " ",
                                2: $("#phase2Auth2").val() + "-" + $("#phase2Enc2").val()
                              }; 
                var keylife = $("#phase2KeyLifetime").val();

                for (i = 0; i <= 31; i++) {
                    var dh = $("#p2dh" + i);
                    if (dh.length > 0 && dh.val() == "enable"){
                        dhgrp += dh + " ";
                    }
                }

                for (j = 0; j <=2; j++ ) {
                    if($("#localSubnet_" + j).length > 0) {
                        phase2[j] = {name: nombreVPN,
                                     dhgrp: dhgrp,
                                     proposal: proposal,
                                     keylife: keylife,
                                     localSubnet: $("#localSubnet_" + j).val() + " " + $("#localMask_" + j).val(),
                                     remoteSubnet: $("#remoteSubnet_" + j).val() + " " + $("#remoteMask_" + j).val()
                                    };
                    }
                }
                crearArchivoConf();
                break;
            }
        }
    }

function generarConf(){
    var infoContacto = `
********************************************
* Referencia: ${info["referencia"]}        *
* Nombre de contacto: ${info["nombre"]}    *
* Telefono: ${info["telefono"]}            *
* Email: ${info["email"]}                  *   
* Modelo de equipo: ${info["modelo"]}      *
* ****************************************** `;
    
    var phase1Conf = `
config vpn ipsec phase1-interface
    edit ${phase1["nombreVPN"]}
        set interface ${phase1['interface']}
        set dpd ${phase1['dpd']}
        set local-gw ${phase1['publicLocal']}
        set dhgrp ${phase1['dhgrp']}
        set proposal ${phase1['proposal']}
        set keylife ${phase1['keepalive']}
        set remote-gw ${phase1['publicRemote']}
        set ${phase1['authMethod']} ${phase1['psk']}
    end`;

    var phase2Conf = `
config vpn ipsec phase2-interface`;

    for (var i = 0; i <3 ; i++) {
        if (phase2[i].length > 0) {
            var phase2Data = phase2[i];
            phase2Conf += `
    edit ${phase2Data['nombreVPN']}_${i}
        set phase1name "${phase2Data['nombreVPN']}
        set dhgrp = ${phase2Data['dhgrp']}
        set proposal = ${phase2Data['proposal']}
        set keylife = ${phase2Data['keylife']}
        set src-subnet = ${phase2Data['localSubnet']}
        set dst-subnet = ${phase2Data['remoteSubnet']}
    next`;
        }
    }
    phase2Conf += `
end`;

    var route = `
config router static`;

    for (var i = 0; i <3 ; i++) {
        if (phase2[i].length > 0) {
            var phase2Data = phase2[i];
            var dst = phase2Data["remoteSubnet"];
            route += `
    edit 0
        set dstaddr ${dst}
        set device "${phase2Data["nombreVPN"]}
    next`;
        }
    }

    route +=`
end`;

return phase1Conf + phase2Conf + route;

}    

function crearArchivoConf(){
    var configuracion = generarConf();

    alert(configuracion);
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

function populateDH(dh, phase, data){      
    
    for (var i = 0; i < data.length; i ++) {     
        var value = data[i];
        var col = `<div class="col-1" id="dh${phase}col${value}"></div>`;        
        var check = `<input type=checkbox class="form-check-input" id = "p${phase}dh${value}" value="${value}"></input>`;
        var label = `<label for="p${phase}dh${value}" id="p${phase}dh${value}Label" style="float: right;">${value}</label>`;
        //alert(value);
        dh.append(col);
        var colId = $("#dh" + phase + "col" + value);
        colId.append(check);
        colId.append(label);
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

  function populatePhase (phase, index, section) { 
    var parent = $("#phase" + phase + "Proposal");
    var file = "https://raw.githubusercontent.com/maxbirman/VPN/main/authenc.csv";
    var data = [];

    getArrayFromFile(file, function(extData) {
        data = extData; 
        switch (section) {
            case "authEnc": {
                var selectEnc = $("#phase" + phase + "Encrypt_" + index);
                var selectAuth = $("#phase" + phase + "Auth_" + index);
                var auth = getOptionsFromArray(data, "auth");
                if(selectEnc.attr("data-message") == "empty"){
                    var enc = getOptionsFromArray(data, "enc");
                    populateSelect(selectAuth, auth);
                    populateSelect(selectEnc, enc);
                    selectEnc.attr("data-message", "full");
                }
                break;
                }                            
            case "dh": {
                var dhGroup = $("#phase" + phase + "DH");                
                if (dhGroup.attr("data-message") == "empty"){
                    var dh = getDH(data);
                    populateDH(dhGroup, phase, dh);
                    dhGroup.attr("data-message", "full");
                }
            }
        }
    });
}