//verificar si todos los campos están completos
function verificarCamposCompletos(divId, siguiente, input) {
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
        case "general": {
            var name = $("#vpnName");
            var charLimitError = $("#charLimit");
            formularioCompleto = verificarCampos(divId, "input") && !charLimit(name);
            if(charLimit(name)) {charLimitError.attr("style", "color: red; padding-left: 2px"); }
            else {charLimitError.attr("style", "color: red; padding-left: 2px; display:none");}
            break;
        }
        case "network": {
            switch(input){
                case "deviceModel": {
                    populateInterfaces();
                    formularioCompleto = false;
                    break;
                }
                case "publicaLocal": {
                    if($("#publicaLocal").val() != ""){
                        if(ipPublicaCorrecta($("#publicaLocal").val()) != ""){
                            $("#errorIpPublica").text(ipPublicaCorrecta($("#publicaLocal").val()));
                            $("#publicaRemota").attr("placeholder", "Introduzca primero la IP pública local");
                            $("#publicaRemota").attr('disabled', 'disabled');
                            formularioCompleto = false;
                        }else {
                            $("#publicaRemota").removeAttr('disabled');
                            $("#publicaRemota").attr("placeholder", "Introduzca la IP pública remota");
                            $("#errorIpPublica").text("");
                            formularioCompleto = verificarCampos(divId, "input") && verificarCampos(divId, "select");
                        }
                    }else {
                        $("#publicaRemota").attr("placeholder", "Introduzca primero la IP pública local");
                        $("#publicaRemota").attr('disabled', 'disabled');
                        formularioCompleto = false;
                    }                    
                    break;
                }        
                case "publicaRemota": {
                    if(ipPublicaCorrecta($("#publicaRemota").val()) != ""){
                        $("#errorIpPublica").text(ipPublicaCorrecta($("#publicaRemota").val()));
                        formularioCompleto = false;
                    }else {
                        $("#errorIpPublica").text("");
                        formularioCompleto = verificarCampos(divId, "input") && verificarCampos(divId, "select");
                        console.log("ip 2: " + formularioCompleto);
                    }
                    break;
                }  
                default: {
                    formularioCompleto = verificarCampos(divId, "input") && verificarCampos(divId, "select");
                }         
            }
        break;
        }
        case "authentication": {
            formularioCompleto = verificarCampos(divId, "input") && verificarCampos(divId, "select");
            break;
        }
        case "phase1Proposal": {
            formularioCompleto = verificarCheckbox(divId) && verificarCampos(divId, "select");
            break;
        }
        case "phase2Proposal":{
            switch(input) {
                case "localSubnet_0": {
                    if (!validarLocalSubnets(0)){
                        formularioCompleto = validarLocalSubnets(0);
                    }
                    break;   
                }
                case "localMask_0": {
                    if (!validarLocalMask(0) || (validarLocalMask(0) && $("#remoteSubnet_0").val() != "")){
                        formularioCompleto = validarLocalMask(0);
                    }
                    break;                    
                }
                case "remoteSubnet_0": {
                    if (!validarRemoteSubnets(0)){
                        formularioCompleto = validarRemoteSubnets(0);
                    }
                    break;   
                }
                case "remoteMask_0": {
                    $("#addSubnet_0").removeAttr('disabled', 'disabled');
                    break;
                }
                case "localSubnet_1": {
                    if (!validarLocalSubnets(1)){
                        formularioCompleto = validarLocalSubnets(1);
                    }
                    break;   
                }
                case "localMask_1": {
                    if (!validarLocalMask(1) || (validarLocalMask(1) && $("#remoteSubnet_1").val() != "")){
                        formularioCompleto = validarLocalMask(1);
                    }
                    break;                    
                }
                case "remoteSubnet_1": {
                    if (!validarRemoteSubnets(1)){
                        formularioCompleto = validarRemoteSubnets(1);
                    }
                    break;   
                }
                case "remoteMask_1": {
                    $("#addSubnet_1").removeAttr('disabled', 'disabled');
                    break;
                }
            }
            if(formularioCompleto = verificarCampos(divId, "input")){
                formularioCompleto = verificarCheckbox(divId) && verificarCampos(divId, "select");
        }    
    }
}
    console.log(formularioCompleto);
    siguiente.prop('disabled', !formularioCompleto); //si no esta completo deshabilita el botón
}
    
    function verificarCampos(divId, type){
        var formularioCompleto = true;
        $("#" + divId +  " " + type + "[required]").each(function() {
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
                console.log(checked);
                return true;
            }
        });
        console.log(checked);
        return checked;
    }

    function validarLocalSubnets(index){	
        var subnet = $("#localSubnet_" + index).val();
        var localMask = $("#localMask_" + index);
        var remoteSubnet = $("#remoteSubnet_" + index);
        var remoteMask = $("#remoteMask_" + index);
        var errorSubnet = $("#subnetError_" + index);
        var error;		
        var formularioCompleto = true;
                        
        if (subnet != ""){
            if ((error = checkSubnet(subnet,index)) != "") {
                errorSubnet.text(error);
                errorSubnet.attr('style', 'color: red; padding-left: 2px;'); 
                localMask.attr('disabled', 'disabled');
                localMask.empty();
                remoteSubnet.attr('disabled', 'disabled');
                remoteSubnet.attr('placeholder', 'Ingresar primero subnet local');
                $("#remoteMask_" + index).attr('disabled', 'disabled');
                $("#addSubnet_" + index).attr('disabled', 'disabled');
            } else{
                if(subnet == '0.0.0.0'){
                    localMask.empty();
                    localMask.append('<option value ="0.0.0.0" selected="selected">0</option>');
                    errorSubnet.attr('style', 'color: red; padding-left: 2px; display: none');
                    localMask.trigger('change');
                }else {
                    localMask.empty();
                    localMask.append('<option value="none" selected="selected" disabled>--</option>');
                    populateMask(localMask);
                    localMask.removeAttr('disabled');          
                    errorSubnet.attr('style', 'color: red; padding-left: 2px; display: none');     
                }
            }

            formularioCompleto = false;
        }else {
            localMask.attr('disabled', 'disabled');
            localMask.empty();
            localMask.attr('disabled', 'disabled');
            remoteSubnet.attr('placeholder', 'Ingresar primero subnet local');
            $("#remoteMask_" + index).attr('disabled', 'disabled');
            $("#addSubnet_" + index).attr('disabled', 'disabled');
        }	
        console.log(error);
        return formularioCompleto;
    }

    function validarRemoteSubnets(index) {
	
        var subnet = $("#remoteSubnet_" + index).val();
        var errorSubnet = $("#subnetError_" + index);
        var error;

        if (subnet != ""){
            if ((error = checkSubnet(subnet,index)) != "") {
                errorSubnet.text(error);
                errorSubnet.attr('style', 'color: red; padding-left: 2px;'); 
                $("#remoteMask_" + index).attr('disabled', 'disabled');
                $("#remoteMask_" + index).empty();
                $("#addSubnet_0").attr('disabled', 'disabled');
                $("#siguiente").attr('disabled', 'disabled');
            } else{
                if(subnet == '0.0.0.0'){
                    $("#remoteMask_" + index).empty();
                    $("#remoteMask_" + index).append('<option value ="0.0.0.0" selected="selected">0</option>');
                    errorSubnet.attr('style', 'color: red; padding-left: 2px; display: none');
                    $("#remoteMask_" + index).trigger('change');
                    errorSubnet.attr('style', 'color: red; padding-left: 2px; display: none');
                }else {
                    $("#remoteMask_" + index).empty();
                    $("#remoteMask_" + index).append('<option value="none" selected="selected" disabled>--</option>');
                    populateMask($("#remoteMask_" + index));
                    $("#remoteMask_" + index).removeAttr('disabled');          
                    errorSubnet.attr('style', 'color: red; padding-left: 2px; display: none');     
                }
            }
            formularioCompleto = false;
        }else {
            $("#remoteMask_" + index).attr('disabled', 'disabled');
            $("#remoteMask_" + index).empty();
            $("#addSubnet_" + index).attr('disabled', 'disabled');
            $("#siguiente").attr('disabled', 'disabled');
        }  

        return formularioCompleto;
    }

    function validarLocalMask(index){
        var remoteSubnet = $("#remoteSubnet_0").val(); 
                    $("#remoteSubnet_" + index).removeAttr('disabled');
                    $("#remoteSubnet_" + index).attr('placeholder', 'Subnet Remota');
                    if(remoteSubnet != ""){
                        $("#remoteMask_" + index).removeAttr('disabled');
                        formularioCompleto = verificarCampos(divId, "input") && verificarCampos(divId, "select");
                        $("#addSubnet_" + index).removeAttr('disabled');
                    } else {
                        formularioCompleto = false;
                    }
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
function charLimit(input){
    if(input.attr('maxlength') !== undefined) {
        var valor = input.val();
        var maxLength = input.attr('maxlength');

        return valor.length == maxLength;
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
        set ike-version ${phase1['ikeVersion']}
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

/*function checkSubnet(subnet, index) {
    var error = "";
    var subnetLocal = $("#localSubnet_" + index).val();
    var subnetRemota = $("#remoteSubnet_" + index).val();
    var mask = $("#localMask_" + index);
    var subnetError = $("#subnetError");

    if (subnet !== ""){
        if(ipCorrecta(subnet)){     //evalua que el formato de IP sea correcto
            if(ipPublicaCorrecta(subnet)){   //evalua que sea una IP privada
                error = "Las subnets deben ser rangos privados";
                mask.empty;
                mask.attr('disable', 'disable');	
                subnetError.text(error);	
                subnetError.attr('style', 'color: red; padding-left: 2px;');								
            } else if (subnetLocal == subnetRemota){
                error = "La subnet local y la subnet remota no pueden ser iguales";
                mask.empty;
                mask.attr('disable', 'disable');
                subnetError.attr('style', 'color: red; padding-left: 2px;');
                subnetError.text(error);
            } else {
                for (var i = 0; i <= 2; i++){
                    if ($("#localSubnet_" + i).length > 0 && i != index) {
                        if($("#localSubnet_" + index) == $("#localSubnet_" + i) && 
                           $("#remoteSubnet_" + index) == $("#remoteSubnet_" + i)){
                             error = "La combinacion de subnet local y subnet remota no pueden ser iguales en las distinta phase2";
                             mask.empty;
                             mask.attr('disable', 'disable');
                             subnetError.text(error);
                           }
                    } 
                }
            }
        } else { 
            error = "Por favor ingrese un formato de IP correcto"; 
            mask.empty;
            mask.attr('disable', 'disable');
            subnetError.text(error);
        }
    }else {
        mask.empty;
        mask.attr('disable', 'disable');
    }
    console.log("error: " + error);
    return error;
}*/
function checkSubnet(subnet, index) {
    var error = "";
    var subnetLocal = $("#localSubnet_" + index).val();
    var subnetRemota = $("#remoteSubnet_" + index).val();
    var mask = $("#localMask_" + index);
    var subnetError = $("#subnetError_" + index);

    if (subnet !== ""){
        if(ipCorrecta(subnet)){     //evalua que el formato de IP sea correcto
            if(!ipPublicaCorrecta(subnet)){   //evalua que sea una IP privada
                error = "Por favor ingrese una IP privada válida";								
            } else if (subnetLocal == subnetRemota){
                error = "La subnet local y la subnet remota no pueden ser iguales";
            } else {
                for (var i = 0; i <= 2; i++){
                    if ($("#localSubnet_" + i).length > 0 && i != index) {
                        alert($("#localSubnet_" + i).length);
                        if($("#localSubnet_" + index).val() == $("#localSubnet_" + i).val() && 
                           $("#remoteSubnet_" + index).val() == $("#remoteSubnet_" + i).val()){
                            error = "La combinacion de subnet local y subnet remota no pueden ser iguales en las distinta phase2";
                        }
                    } 
                }
            }
       } else { 
            error = "Por favor ingrese una IP privada válida"; 
        }
    }
    console.log("error: " + error);
    return error;
}
//verificar si el formato de la IP es correcto
function ipPublicaCorrecta (ip) {
    var result = "";
    var publicaLocal = $("#publicaLocal").val();
    var publicaRemota =  $("#publicaRemota").val();

    if(publicIpRegex.test(ip)) {
        if(publicaLocal == publicaRemota){
            result = "La IP pública local y la IP pública remota no pueden ser iguales";
        } 
    }else {
            result = "Por favor introduzca una IP pública valida";
        }   
    
    //console.log(result);    
    return result;
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
        var check = `<input type="checkbox" class="form-check-input check" id = "p${phase}dh${value}" value="${value}" required onchange="verificarCamposCompletos($(this).closest('.formDiv').attr('id'), $('#siguiente'), $(this).attr('id'))"></input>`;
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
        if (option[1] != "undefined"){
            select.append('<option value="' + option[0] + '">' + option[1] + '</option>');
            //console.log(i + " " + option[0] + "," + option[1]);
        }        
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

 function populateMask(select){
   var file = "https://maxbirman.github.io/VPN/masks.txt";
   var data = [];

    getArrayFromFile(file, function(extData) {
        data = extData;
        populateSelect(select, data);
    });    
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
                if(selectAuth.attr("data-message") == "empty"){
                    populateSelect(selectAuth, auth);
                    selectAuth.attr("data-message", "full");
                }
                if(selectEnc.attr("data-message") == "empty"){
                    var enc = getOptionsFromArray(data, "enc");                  
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