//asigna funcion al clickear en "siguiente" - oculta div actual y pasa al siguiente
function Siguiente (){

    var name = siguiente.getAttribute("data-message");
    
    switch (name) {
        case "contacto": {
            nextPanel ("contacto", "general");
            break;
            }
        case "general": {
            nextPanel("general", "network");
            populateModels();						
            break;
            }
        case "network": {           
            nextPanel("network", "authentication");    
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
            
            break;
            }
        case "phase2Proposal": {
            nextPanel("phase2Proposal", "policies");
            cargarDatos("phase2Proposal");
            $("#siguiente").text("Finalizar");  // al pasar al ultimo div "siguiente" se convierte en "finalizar"
            break;
        }
        case "policies": {
            
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
function populateInterfaces(select){
    var device = $("#deviceModel").val();
    var file = "https://raw.githubusercontent.com/maxbirman/VPN/main/interfaces.csv";
    var data = [];
     
    getArrayFromFile(file, function(extData) {
        data = extData;
        var interfaceList = getOptionsFromArray(data, device);
        select.empty();
        select.append('<option value="" disabled selected="selected">--Seleccione una interface--</option>');
        populateSelect(select, interfaceList);
    })
    
    select.removeAttr('disabled');
    //$("#siguiente").attr('disabled', 'disabled')

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
        $("#ikeMode").empty();
        $("#ikeMode").append('<option value="none" selected="selected"></option>');
        //console.log("ike: " + $("#ikeMode").val());

    } else {
        $("#ikeMode").empty();
        $("#ikeMode").append('<option value="main" selected="selected">Main</option>');
        $("#ikeMode").append('<option value="aggresive">Aggresive</option>');
        //console.log("ike: " + $("#ikeMode").val());
        $("#ikeModeParent").removeAttr('style');
    }
}    

function updateEnc (phase, index) {
    
    var currentEncSelect = $("#phase" + phase + "Encrypt_" + (index));    
    currentEncSelect.empty();
    currentEncSelect.attr("data-message", "empty");
    populatePhase(phase, index, "authEnc");    
}

function addAuthEnc(phase, index){
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
                                        <select class="form-control" id="phase${phase}Auth_${index}" name="phase${phase}Auth_${index}" data-message= "empty" required onchange="updateEnc(${phase},${index})"> </select>
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
                            <div class="col-1">
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
    
    $("#phase" + phase + "Auth_" + prevIndex).attr('disabled', 'disabled');
    $("#phase" + phase + "Encrypt_" + prevIndex).attr('disabled', 'disabled');
}

function removeAuthEnc(phase,index) {
    currentId = 'p' + phase + 'AE_' + index;    
    prevId = 'p' + phase + 'AE_' + (index - 1);

    $("#" + currentId).remove();

    $("#p" + phase + "AEAdd_" + (index - 1)).removeAttr("style");
    $("#p" + phase + "AERemove_" + (index - 1)).removeAttr("style");
    $("#phase" + phase + "Auth_" + (index - 1)).removeAttr('disabled');
    $("#phase" + phase + "Encrypt_" + (index - 1)).removeAttr('disabled');

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
                        <input type="text" class="form-control subnet" id="localSubnet_${index}" aria-describedby="nameHelp" placeholder="Subnet Local" required>
                        <small id="subnetError_${index}" style="color: red; padding-left: 2px; display:none"></small>
                    </div>
                    <div class="col-1 ps-0">
                        <select class="form-control" name="localMask" id="localMask_${index}" required disabled>							
                        </select>
                    </div>								
                    <div class="col-3 pe-0">
                        <input type="text" class="form-control subnet" id="remoteSubnet_${index}" placeholder="Ingresar primero subnet local" disabled required aria-describedby="nameHelp">
                    </div>
                    <div class="col-1 ps-0">
                        <select class="form-control" name="remoteMask" id="remoteMask_${index}" required disabled>
                        </select>
                    </div>
                    <div class="col-1">
                        <div class="row">
                            <div class="col-6" id="removeButton_${index}">
                                <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="removeSubnet_${index}" onclick="removeSubnets(${index})">-</a>
                            </div> 
                            <div class="col-6" id="addButton_${index}">
                                <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="addSubnet_${index}" onclick="addSubnets(${nextIndex})" disabled>+</a>
                            </div>                                    
                        </div>                                
                    </div>`);	

    $('#removeSubnet_' + index).on('click', removeSubnets);
   

    $('#addSubnet_' + prevIndex).attr("style", "display:none");
    $('#removeSubnet_' + prevIndex).attr("style", "display:none");

    if (nextIndex == 3){
        $("#addSubnet_" + index).attr('style', 'display:none');
    }   

    $('.formDiv select').on('change', function() {
        var divId = $(this).closest('.formDiv').attr('id');
        verificarCamposCompletos(divId, $("#siguiente"), $(this).attr('id'));
    });  

    $('.formDiv input[required]').on('input', function() {
        var divId = $(this).closest('.formDiv').attr('id');
        verificarCamposCompletos(divId, $("#siguiente"), $(this).attr('id'));

    });
    $("#siguiente").attr('disabled', 'disabled');
}

function removeSubnets(index){
    currentId = "subnets_" + index;
    prevId = "subnets_"  + (index -1);

    $("#" + currentId).remove();

    $("#addSubnet_" + (index - 1)).removeAttr("style");
    $("#removeSubnet_" + (index - 1)).removeAttr("style");

    verificarCamposCompletos("phase2Proposal", $("#siguiente"), "remoteMask_" + (index - 1));
}

function addPolicy(index){
    var childId = "policy_" + index; 
	var nextIndex = index + 1;
	var prevIndex = index - 1;

    jQuery('<div>', {
        class: 'row mb-1 mt-3',
		id: childId
    }).appendTo('#policiesList');

    $('#' + childId).append(`
                    <div class="col-3">
                        <div class="row">
                            <div class="col-4">
                                <label class="p-2" for="policyDirection" id="policyDirectionLabel">Direcci&oacute;n</label>
                            </div>
                            <div class="col-8">
                                <select class="form-control" id="policyDirection_${index}" name="policyDirection" required>
                                    <option value="src-intf">Desde VPN</option>
                                    <option value="dst-intf">Hacia VPN</option>
                                </select>
                            </div>    
                        </div>                                
                    </div>                            
                    <div class="col-4">
                        <div class="row">                                    
                            <div class="col-4">
                                <label class="p-2" for="srcAddress" name="srcAddressLabel" id="srcAddressLabel_${index}">Origen</label>
                            </div>
                            <div class="col-5 pe-0">
                                <input type="text" class="form-control" id="srcAddress_${index}" name="srcAddress" placeholder="IP de origen" required>
                            </div>
                            <div class="col-3 ps-0">
                                <select class="form-control" id="srcAddressMask_${index}" name="srcAddressMask" required>
                                    <option value="none" selected disabled>0</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">                                
                        <div class="row">
                            <div class="col-4">
                                <label class="p-2" for="dstAddress" name="dstAddressLabel" id="dstAddressLabel_${index}">Destino</label>
                            </div>
                            <div class="col-5 pe-0">
                                <input type="text" class="form-control" id="dstAddress_${index}" name="dstAddress" placeholder="IP de destino" required>                             
                            </div>
                            <div class="col-3 ps-0">
                                <select class="form-control" id="srcAddressMask_${index}" name="srcAddressMask" required>
                                    <option value="none" selected disabled>0</option>
                                </select>
                            </div>
                        </div>                                
                    </div>
                    <div class="col-1">
                        <div class="row">
                            <div class="col-6" id="removePolicyButton_${index}">
                                <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="removePolicy_${index}" onclick="RemovePolicy(${nextIndex})">-</a>
                            </div>
                            <div class="col-6" id="addPolicyButton_${index}">
                                <button type="button" class="btn btn-primary" tabindex="-1" role="button" aria-disabled="true" id="addPolicy_${index}" onclick="addPolicy(${nextIndex})">+</a>
                            </div>                                    
                        </div>                                
                    </div>`
    );

    $('#addPolicy_' + prevIndex).attr("style", "display:none");
    $('#removePolicy_' + prevIndex).attr("style", "display:none");

    console.log("Next Index = " + nextIndex);
    if (nextIndex == 5){
        $("#addPolicy_" + index).attr('style', 'display:none');
    }   
}
        
function removePolicy(index){
    currentId = "policy_" + index;
    prevId = "policy_"  + (index -1);

    $("#" + currentId).remove();

    $("#addPolicy_" + (index - 1)).removeAttr("style");
    $("#removePolicy_" + (index - 1)).removeAttr("style");

    verificarCamposCompletos("policies", $("#siguiente"), "dstAddressMask_" + (index - 1));
}     

