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
                            cargarDatos("network");						
                            $("#network").attr("style","display:none");
                            $("#authentication").removeAttr("style");
                            $("#anterior").attr("data-message", "authentication");
                            $("#siguiente").attr("data-message", "authentication");
                            //$("#siguiente").attr('disabled', 'disabled');
                            verificarCamposCompletos("authentication", siguiente);
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
            $("#authentication").attr("style","display:none");
            $("#phase1Proposal").removeAttr("style");
            $("#anterior").attr("data-message", "phase1Proposal");
            $("#siguiente").attr("data-message", "phase1Proposal");
            verificarCamposCompletos("phase1Proposal", siguiente);
            cargarDatos("authentication");
            break;
            }
        case "phase1Proposal": {
            $("#phase1Proposal").attr("style","display:none");
            $("#phase2Proposal").removeAttr("style");
            $("#anterior").attr("data-message", "phase2Proposal");
            $("#siguiente").attr("data-message", "phase2Proposal");
            //$("#siguiente").attr('disabled', 'disabled');
            verificarCamposCompletos("phase2Proposal", siguiente);
            cargarDatos("phase1Proposal");
            $(this).text("Finalizar"); // al pasar al ultimo div "siguiente" se convierte en "finalizar"
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
function populateInterfaces(select){
        
    var selected = select.val();
    var select = $("#interface");
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

