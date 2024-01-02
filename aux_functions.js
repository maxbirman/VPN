//verificar si todos los campos están completos
function verificarCamposCompletos(divId, siguiente) {
    var formularioCompleto = true;

    switch (divId) {
        case "contacto": {
            var email = $("#email").val();
            var errorEmail = $("#emailError");
            formularioCompleto = verificarCampos(divId, "input") && emailCorrecto(email);
            if(!emailCorrecto(email)) {errorEmail.attr("style", "color: red; padding-left: 2px");}
            else {errorEmail.attr("style", "color: red; padding-left: 2px; display:none");}
            
            break;
        }
        default:
            if(formularioCompleto = verificarCampos(divId, "input")){
                formularioCompleto = verificarCampos(divId, "select");
        }    
    }

    /*if(formularioCompleto && (divId == "phase1Proposal" || divId == "phase2Proposal")) {
        formularioCompleto = verificarCheckbox(divId);
    }*/
    //console.log("formulario completo: " + formularioCompleto);
    siguiente.prop('disabled', !formularioCompleto); //si no esta completo deshabilita el botón
}
    
    function verificarCampos(divId, type){
        var formularioCompleto = true;
        $("#" + divId +  " " + type + "[required]").each(function() {
            // console.log($(this).attr("id") + ": " + $(this).val());
           // Verificar si el campo está vacío
           if ($(this).val() === null || $(this).val() === '') {
             formularioCompleto = false;
             return false; // Romper el bucle si se encuentra un campo vacío
           }
         });
         return formularioCompleto;
    }

    function verificarCheckbox(divId){
        var checked = false;
        $('#' + divId + ' input[type="checkbox"]').each(function() {
            if($(this).prop('checked')) {
                checked = true;
                return true;
            }
        });
        return checked;
    }

function verificarAutEnc(phase, index, data, selected) {   
    //console.log(index);
    if (index > 0) {
        index = index -1;
        var selectedAuth = $("#phase" + phase + "Auth_" + index).val();
        var selectedEnc = $("#phase" + phase + "Encrypt_" + index).val();
        if(selected == selectedAuth) {
            var tempData = data.split("\n");
            data = "";
     
            for (var i = 0; i < tempData.length; i++) {
                var tempSelected = selectedEnc + ";" + selectedEnc;
                if(tempData[i] != tempSelected){
                   data += tempData[i];
                   console.log(i);
                   console.log(data);
                   if (i < tempData.length) {data += "\n";}     
                }
            }
        }
        
        return verificarAutEnc(phase, index, data, selected);
    }else {
        //console.log(data);
        return data;
    }

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
               phase1["publicLocal"] = $("#publicaLocal").val();
               phase1["publicRemote"] = $("#publicaRemota").val();
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
                var proposal = "";

                for (var i = 0; i <= 2; i++) {
                    if($("#phase1Auth_" + i).length > 0){
                        proposal += $("#phase1Auth_" + i).val() + "-" + $("#phase1Encrypt_" + i).val() + " ";
                    }
                }
               phase1["proposal"] = proposal;

                var dhgrp = "";

                for (i = 1; i <= 31; i++) {
                    var dh = $("#p1dh" + i);
                    if (dh.length > 0 && dh.is(':checked')){
                        dhgrp += (dh.val() + " ");
                    }

                phase1["dhgrp"] = dhgrp;    
               
                }
                break;                                
            }
            case "phase2Proposal": {
                var nombreVPN = phase1["nombreVPN"];
                var proposal = "";
                for (var i = 0; i <= 2; i++) {
                    if($("#phase2Auth_" + i).length > 0){
                        proposal += $("#phase2Auth_" + i).val() + "-" + $("#phase2Encrypt_" + i).val() + " ";
                    }
                }
                var keylife = $("#phase2KeyLifetime").val();

                var dhgrp = ""
                for (i = 1; i <= 31; i++) {
                    var dh = $("#p2dh" + i);
                    if (dh.length > 0 && dh.is(':checked')){
                        dhgrp += (dh.val() + " ");
                    }  

                }
                for (var j = 0; j <=2; j++ ) {
                    
                    if($("#localSubnet_" + j).length > 0) {
                        phase2[j] = {name: nombreVPN,
                                     dhgrp: dhgrp,
                                     proposal: proposal,
                                     keylife: keylife,
                                     localSubnet: $("#localSubnet_" + j).val() + " " + $("#localMask_" + j).val(),
                                     remoteSubnet: $("#remoteSubnet_" + j).val() + " " + $("#remoteMask_" + j).val()                                     
                                    };
                                    alert(nombreVPN + " " + phase2[j]["name"]);
                                    
                    }else phase2[j] = "";
                }
                crearArchivoConf();
                break;
            }
        }
    }

function generarConf(){
    var infoContacto = `
********************************************
* Referencia: ${info["referencia"]}        
* Nombre de contacto: ${info["nombre"]}    
* Telefono: ${info["telefono"]}            
* Email: ${info["email"]}                    
* Modelo de equipo: ${info["modelo"]}      
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

    for (var i = 0; i < phase2.length ; i++) {
        if (phase2[i] != "") {
            var phase2Data = phase2[i];
            phase2Conf += `
    edit ${phase2Data["name"]}_${i}
        set phase1name ${phase2Data["name"]}
        set dhgrp ${phase2Data["dhgrp"]}
        set proposal ${phase2Data["proposal"]}
        set keylife ${phase2Data["keylife"]}
        set src-subnet ${phase2Data["localSubnet"]}
        set dst-subnet ${phase2Data["remoteSubnet"]}
    next`;
        }
    }
    phase2Conf += `
end`;

    var route = `
config router static`;

    for (var i = 0; i < phase2.length ; i++) {
        if (phase2[i] != "") {
            var phase2Data = phase2[i];
            route += `
    edit 0
        set dstaddr ${phase2Data['remoteSubnet']}
        set device "${phase2Data['name']}"
    next`;
        }
    }

    route +=`
end`;

return infoContacto + phase1Conf + phase2Conf + route;

}    

function crearArchivoConf(){
    var configuracion = generarConf();

    var clave = info["referencia"];

    var encryptado = CryptoJS.AES.encrypt(configuracion,clave).toString();

    var blob = new Blob([encryptado], {type: 'text/plain'});

    var enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = window.URL.createObjectURL(blob);
    enlaceDescarga.download = info["referencia"] + "_ipsec.soc";

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();

    document.body.removeChild(enlaceDescarga);
}
function checkSubnet(inputId, index) {
    
    var input = $("#" + inputId); 
    var ip = input.val();

    var select = $("#localMask_" + index);
                        

    if(inputId == "remoteSubnet_" + index){  //si se aplica a la subnet remota
        select = $("#remoteMask_" + index);
    }					
    
    if (ip !== ""){
        if(ipCorrecta(ip)){     //evalua que el formato de IP sea correcto
            if(ipPublicaCorrecta(ip)){   //evalua que sea una IP privada
                alert("Las subnets deben ser privadas"); //si es una IP publica da error
                return;														
            
            }
            else if (ip =="0.0.0.0") {
                    select.empty();
                    var maskList = "0.0.0.0;/0"; // en caso de que la red sea 0.0.0.0 solo se permite mascara 0
                    populateSelect(select, maskList);
                    select.attr('disabled','disabled');

                }else if($("#localSubnet_" + index).val() == $("#remoteSubnet_" + index).val()){
                alert("Las subnets no pueden ser iguales");
                } else if (claseARegex.test(ip)) {

                    var file = "https://maxbirman.github.io/VPN/masks.txt";
                    var data = [];
                    getArrayFromFile(file, function(extData) {
                        data = extData;  
                        var masks = getMasks(data, 8);  
                        select.empty();        
                        populateSelect(select,masks);
                        select.removeAttr("disabled");
                    });                   

                    
                }
                else if (claseBRegex.test(ip)) {
                    var file = "https://maxbirman.github.io/VPN/masks.txt";
                    var data = [];
                    getArrayFromFile(file, function(extData) {
                        data = extData;  
                        var masks = getMasks(data, 16);  
                        select.empty();        
                        populateSelect(select,masks);
                        select.removeAttr("disabled");
                    });    
                }
                else {
                    var file = "https://maxbirman.github.io/VPN/masks.txt";
                    var data = [];
                    getArrayFromFile(file, function(extData) {
                        data = extData;  
                        var masks = getMasks(data, 24);  
                        select.empty();        
                        populateSelect(select,masks);
                        select.removeAttr("disabled");
                    });    	
                }
            }
                } else {alert("Por favor introduzca un formato de IP válido");}		


};
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

/*function checkEmail(){
    var email = $("#email").val();
    
    if(emailRegex.test(email)) {
        $("#emailError").attr("style", "color: red; padding-left: 2px; display:none");
        $("#siguiente").removeAttr('disable');
        
    } else {
        $("#emailError").attr("style", "color: red; padding-left: 2px");
        $("#siguiente").attr('disable', 'disable');
    }
}*/

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
        var check = `<input type=checkbox class="form-check-input check" id = "p${phase}dh${value}" value="${value}" required></input>`;
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
    var file = "https://maxbirman.github.io/VPN/interfaces.txt";
    var data = [];
    getArrayFromFile(file, function(extData) {
        data = extData;            
        populateSelect(select,data);
    });                   
  }

  function getMasks(data, base) {
    var splitData = data.split("\n");
    var masks = "";

    for (var i = 0; i < splitData.length; i ++){
        var temp = splitData[i].split(";");
        if (temp[1] >= base){
            masks += temp[0] + ";/" + temp[1] + "\n";
        }
    }

    return masks;
  }

  function populatePhase (phase, index, section) { 
    var parent = $("#phase" + phase + "Proposal");
    var file = "https://maxbirman.github.io/VPN/authenc.txt";
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
                    enc = verificarAutEnc(phase, index, enc, selectAuth.val());
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