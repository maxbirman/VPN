//Variables para referenciar los datos ingresados por el usuario
            //contacto
            var referencia;
            var emailPrincipal = "";
            //General
            var vpn;
            //Network
            var publicaLocal;
            var publicaRemota;
            var natTraversal;
            var keepAlive;
            var dpd;
            //Authentication
            var authMethod;
            var psk;
            var signature;
            var ikeVersion;
            var ikeMode;
            //Phase1
            var phase1Proposal;			
            var phase1DiffieHellman;
            //Phase2
            var phase2Proposal;
            var phase2DiffieHellman;
            var localSubnet;
            var remoteSubnet;
            var phase2KeyLifetime;

        //Variables para referenciar los botones
            var previousButton = $("#anterior");
            var nextButton = $("#siguiente");
        
        //clave para cifrar archivo de salida
            var clave;
        

        //variables para cargar los select de modelos e interfaces
            var modelo;
            var interfaces;    

        //Regex para validar email e IPs
            var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/; 
            var ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
            var publicIpRegex = /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?<!172\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31))(?<!127)(?<!^10)(?<!^0)\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?<!192\.168)(?<!172\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31))\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
            var claseARegex = /^((?:10)\.)((?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){2}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
            var claseBRegex = /^(?:(?:172)\.)(?:(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\.)((?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){1}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
            var claseCRegex = /^(?:(?:192)\.)(?:(?:168)\.)((?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){1}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;    