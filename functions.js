//asigna funcion al clickear en "siguiente" - oculta div actual y pasa al siguiente
function Siguiente (){

    var name = siguiente.getAttribute("data-message");
    
    switch (name) {
        case "contacto": {
            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if(emailRegex.test($('#email').val())){
               nextPanel ("contacto", "general");
            } else {alert("Por favor ingrese un email valido");}
            break;
            }
        case "general": {
            nextPanel("general", "network");
            populateModels();						
            break;
            }
        case "network": {
            publicaLocal = $("#publicaLocal").val();
            publicaRemota = $("#publicaRemota").val();

            if(ipCorrecta(publicaLocal) && ipCorrecta(publicaRemota)){      
                if(ipPublicaCorrecta(publicaLocal) && ipPublicaCorrecta(publicaRemota)){                      	
                    if(publicaLocal !== publicaRemota){    
                        nextPanel("network", "authentication");
                        }else {alert("Las IP pública local y la IP pública remota no pueden ser iguales")}
                    }else if (ipPublicaCorrecta(publicaLocal) && !ipPublicaCorrecta(publicaRemota)){
                        alert("La IP remota introducida no es una IP pública");
                    }else if (ipPublicaCorrecta(publicaRemota) && !ipPublicaCorrecta(publicaLocal)){
                        alert("La IP local introducida no es una IP pública");
                    }else {alert("Las IPs introducidas no son IPs públicas");}
                }else if(ipCorrecta(publicaLocal) && !ipCorrecta(publicaRemota)){
                    alert("El valor introducido como IP pública remota no es un formato IP válido");
                }else if(ipCorrecta(publicaLocal) && !ipCorrecta(publicaRemota)){
                    alert("El valor introducido como IP pública local no es un formato IP válido");
                }else {alert("Los valores introducidos como IPs públicas no son formatos IP válidos")}
            break;
            }
        case "authentication": {
            nextPanel("authentication", "phase1Proposal");
            populatePhase("1","0", "authEnc");
            populatePhase("1", "0", "dh")
            break;
            }
        case "phase1Proposal": {
            nextPanel("phase1Proposal", "phase2Proposal");
            populatePhase("2", "0", "authEnc");
            populatePhase("2", "0", "dh");
            $("#siguiente").text("Finalizar"); // al pasar al ultimo div "siguiente" se convierte en "finalizar"
            break;
            }
        case "phase2Proposal": {
            cargarDatos("phase2Proposal");
            generarConfig();
        }
        }
    }
//asigna funcion al clickear en "anterior" - oculta div actual y vuelve al anterior	
function Anterior(anterior){

    var name = anterior.getAttribute("data-message");    
    var siguiente = $("#siguiente");        

    switch (name) {
        case "general": {
            $("#general").attr("style","display:none");
            $("#contacto").removeAttr("style");
            $("#anterior").attr("style", "display:none");
            $("#siguiente").attr("data-message", "contacto");
            verificarCamposCompletos("contacto", siguiente);
            break;
        }
        case "network": {
            $("#network").attr("style","display:none");
            $("#general").removeAttr("style");
            $("#anterior").attr("data-message", "general");
            $("#siguiente").attr("data-message", "general");
            verificarCamposCompletos("general", siguiente);
            break;
        }
        case "authentication": {
            $("#authentication").attr("style","display:none");
            $("#network").removeAttr("style");
            $("#anterior").attr("data-message", "network");
            $("#siguiente").attr("data-message", "network");
            verificarCamposCompletos("network", siguiente);
            break;
        }
        case "phase1Proposal": {
            $("#phase1Proposal").attr("style","display:none");
            $("#authentication").removeAttr("style");
            $("#anterior").attr("data-message", "authentication");
            $("#siguiente").attr("data-message", "authentication");
            verificarCamposCompletos("general", siguiente);
            break;
        }
        case "phase2Proposal": {
            $("#phase2Proposal").attr("style","display:none");
            $("#phase1Proposal").removeAttr("style");
            $("#anterior").attr("data-message", "phase1Proposal");
            $("#siguiente").attr("data-message", "phase1Proposal");
            $("#siguiente").text("Siguiente"); // Vuelve a tomar el texto de "siguiente"
            verificarCamposCompletos("phase1Proposal", siguiente);
            break;
        }
    }	
   
}
function populateInterfaces(){
    var select = $("#deviceModel");
    var selected = select.val();
    select = $("#interface");
    var file = "https://raw.githubusercontent.com/maxbirman/TESTGITHUB/main/interfaces.csv";
    var data = [];
     
    getArrayFromFile(file, function(extData) {
        data = extData;
        var interfaceList = getOptionsFromArray(data, selected);
        select.empty();
        select.append('<option value="" disabled selected="selected">--Seleccione una interface--</option>');
        populateSelect(select, interfaceList);
    })
    
    select.removeAttr('disabled');

    } 
function pskOrCert(){
    if($("#authMethod").val() == "psk"){
        $("#pskOrCertificate").text("PSK");
    }else{
        $("#pskOrCertificate").text("Certificado");
    }
} 

function hideShowMode() {
    if ($("#ikeVersion").val() == "2") {
        $("#ikeModeParent").attr('style', 'display:none;');
    } else {
        $("#ikeModeParent").removeAttr('style');
    }
}    

function addAuthEnc(phase, index){   //0 , 1
    var parentId = 'p' + phase + 'AE';
    var childId = parentId + "_" + index;
    var nextIndex = index + 1;
    var prevIndex = index - 1;

    jQuery('<div>', {
        class: 'row mt-2',
        id: childId        
    }).appendTo("#" + parentId);

    $("#" + childId).append(`
                            <div class="col-5">
                                <div class="row">
                                    <div class="col-4"></div>	
                                    <div class="col-8">
                                        <select class="form-control" id="phase${phase}Auth_${index}" name="phase${phase}Auth_${index}" data-message= "empty" required></select>
                                    </div>	
                                </div>
                            </div>
                            <div class="col-5">
                                <div class="row">
                                    <div class="col-4"></div>	
                                    <div class="col-8">
                                        <select class="form-control" id="phase${phase}Encrypt_${index}" name="phase${phase}Encrypt_${index}" data-message="empty" required></select>
                                    </div>	
                                </div>
                            </div>	
                            <div class="col-2">
                                <div class="row">
                                    <div class="col-6" id="p${phase}AERemoveButton_${index}">
                                        <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="p${phase}AERemove_${index}" onclick="removeAuthEnc(${phase}, ${index})">-</a>
                                    </div>
                                    <div class="col-6" style="float: right;" id="p${phase}AEAddButton_${index}">
                                        <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="p${phase}AEAdd_${index}" onclick="addAuthEnc(${phase}, ${nextIndex})">+</a>
                                    </div>                                    
                                 </div>                                
                            </div>    `)

    populatePhase(phase, index, "authEnc");                        

    $("#p" + phase + "AEAdd_" + prevIndex).attr('style', 'display:none');
    $("#p" + phase + "AERemove_" + prevIndex).attr('style', 'display:none');

    if (nextIndex == 3){
        $("#p" + phase + "AEAdd_" + index).attr('style', 'display:none');
    }                        
}

function removeAuthEnc(phase,index) {
    currentId = 'p' + phase + 'AE_' + index;    
    prevId = 'p' + phase + 'AE_' + (index - 1);

    $("#" + currentId).remove();

    $("#p" + phase + "AEAdd_" + (index - 1)).removeAttr("style");
    $("#p" + phase + "AERemove_" + (index - 1)).removeAttr("style");

}

function addSubnets(index){
 
    var childId = "subnets_" + index; 
	var nextIndex = index + 1;
	var prevIndex = index - 1;

    //alert(currentSubnet);
    
    jQuery('<div>', {
        class: 'row mt-2',
		id: childId

    }).appendTo('#subnets');

    $('#' + childId).append(
                    `<div class="col-1 me-2 mt-2">
                        <labelclass="pt-2"></label>
                    </div>								
                    <div class="col-3 ms-5 pe-0">
                        <input type="localSubnet" class="form-control subnet"  onblur="checkSubnet(this)" id="localSubnet_${index}" aria-describedby="nameHelp" placeholder="Local Subnet" required>
                    </div>
                    <div class="col-1 ps-0">
                        <select class="form-control" name="localMask" id="localMask_${index}" disabled>							
                        </select>
                    </div>								
                    <div class="col-3 pe-0">
                        <input type="remoteSubnet" class="form-control subnet" onblur="checkSubnet(this)"  id="remoteSubnet_${index}" aria-describedby="nameHelp" placeholder="Remote Subnet" required>
                    </div>
                    <div class="col-1 ps-0">
                        <select class="form-control" name="remoteMask" id="remoteMask_${index}" disabled>
                        </select>
                    </div>
                    <div class="col-1">
                        <div class="row">
                            <div class="col-6" id="removeButton_${index}">
                                <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="removeSubnet_${index}" onclick="removeSubnets(${index})">-</a>
                            </div> 
                            <div class="col-6" id="addButton_${index}">
                                <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="addSubnet_${index}" onclick="addSubnets(${nextIndex})">+</a>
                            </div>                                    
                        </div>                                
                    </div>`);	

    $('#removeSubnet_' + index).on('click', removeSubnets);
   

    $('#addSubnet_' + prevIndex).attr("style", "display:none");
    $('#removeSubnet_' + prevIndex).attr("style", "display:none");

    if (nextIndex == 3){
        $("#addSubnet_" + index).attr('style', 'display:none');
    }   
}

function removeSubnets(index){
    currentId = "subnets_" + index;
    prevId = "subnets_"  + (index -1);

    $("#" + currentId).remove();

    $("#addSubnet_" + (index - 1)).removeAttr("style");
    $("#removeSubnet_" + (index - 1)).removeAttr("style");
}
    
        
     

