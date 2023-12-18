
var M;
class Main implements EventListenerObject {
    public dispositivos: Array<Device> = new Array<Device>();


    private buscarPersonas() {
        for (let u of this.dispositivos) {
            console.log(u.mostrar(), this.dispositivos.length);
        }
    }

    private getDevices() {

        let xmlRequest = new XMLHttpRequest();
    
        xmlRequest.onreadystatechange = () => {
    
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log(xmlRequest.responseText, xmlRequest.readyState);
                    let respuesta = xmlRequest.responseText;
                    let datos: Array<Device> = JSON.parse(respuesta);
    
                    let ul = document.getElementById("listaDisp");
    
                    for (let d of datos) {
                        let itemList = `<li class="collection-item avatar">
                            <img src="./static/images/lightbulb.png" alt="" class="circle">
                            <span class="title">${d.name}</span>
                            <p>${d.description}</p>`;
    
                        if (d.type === "on/off") {
                            // Para los dispositivo que sean de tipo "on/off", se pone un switch
                            itemList += `<div class="switch">
                                <label>
                                    Off
                                    <input type="checkbox" deviceId="${d.id}" type="${d.type}" id="cb_${d.id}"${d.value ? " checked" : ""}>
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>`;
                        } else if (d.type === "variable") {
                            // y para los de tipo "variable" va un elemento range con mínimo 0% y máx 100%. Se pone en una columna de 6 espacios para que no ocupe todo el ancho del list item
                            itemList += `<div class="row">
                                <div class="col s6">
                                <form action="#">
                                    <p class="range-field">
                                        <input type="range" deviceId="${d.id}" type="${d.type}" id="range_${d.id}" min="0" max="100" value="${d.value}" />
                                    </p>
                                </form>
                                <label for="range_${d.id}_min">0%</label>
                                <label for="range_${d.id}_max" class="right">100%</label>
                                </div>
                            </div>`;
                        }
    
                        // Agrega el resto del contenido
                        itemList += `<a href="#!" class="secondary-content">
                            <label>Eliminar dispositivo </label>
                            <i class="Small material-icons" eliminarDeviceId="${d.id}" id="eliminar_${d.id}">delete</i>
                        </a>
                    </li>`;
    
                        ul.innerHTML += itemList;
                    }
    
                    for (let d of datos) {
                        if (d.type === "on/off") {
                            // Agrega el listener para el cambio de estado en el tipo "on/off"
                            let checkbox = document.getElementById("cb_" + d.id);
                            checkbox.addEventListener("change", this);
                        } else if (d.type === "variable") {
                            // Agrega el listener para el cambio de valor en el tipo "variable"
                            let range = document.getElementById("range_" + d.id);
                            range.addEventListener("input", this);
                        }
    
                        // Agrega el listener para eliminar en ambos casos
                        let eliminar = document.getElementById("eliminar_" + d.id);
                        eliminar.addEventListener("click", this);
                    }
                } else {
                    console.log("No se encontraron dispositivos");
                }
            }
        };
    
        xmlRequest.open("GET", "http://localhost:8000/devices", true);
        xmlRequest.send();
    }
    

    private borrarDevices() {
        let ul = document.getElementById("listaDisp");
        console.log(ul)
        // Verifica si la lista existe
        if (ul) { //(listaUl) {
            // forma 1 de eliminar lista: eliminar todos los elementos li dentro de ella
            /*while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }*/
            //forma 2 de eliminar lista: asignarle contenido nulo
            ul.innerHTML = ""
            //probé y ambasfuncionan me quedo con la segunda porque me parece más práctica
        }
        console.log(ul);
    }

    private manipularLista() {
        let ul = document.getElementById("listaDisp");
        let botonListar = document.getElementById("btnListar");
        this.borrarDevices();
        if (ul && ul.childElementCount === 0) {
            // Si la lista está vacía, mostrar y cambiar el botón a "Ocultar"
            this.getDevices();
            //botonListar.innerText = "Ocultar";
        }
    }

    private ejecutarPutCB(id: number) {
        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("respuesta del backend: status "+ xmlRequest.status +", "+ xmlRequest.responseText);
                } else {
                    alert("Error en la consulta: satus " + xmlRequest.status + ', ' + xmlRequest.responseText);
                }
            }
        }

        xmlRequest.open("PUT", "http://localhost:8000/device", true);
        xmlRequest.setRequestHeader("Content-Type", "application/json");

        let checkbox = <HTMLInputElement>document.getElementById(`cb_${id}`);
        let currentValue = checkbox.checked ? 1 : 0; // 1 si está activado, 0 si está desactivado
        
        let s = {
            id: id,
            value: currentValue
        };//el json a enviar en el body del post

        xmlRequest.send(JSON.stringify(s));
    }

    private ejecutarPutRange(id: number) {
        let xmlRequest = new XMLHttpRequest();
        
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("respuesta del backend: status "+ xmlRequest.status +", "+ xmlRequest.responseText);
                } else {
                    alert("Error en la consulta: satus " + xmlRequest.status + ', ' + xmlRequest.responseText);
                }
            }
        }

        xmlRequest.open("PUT", "http://localhost:8000/device", true);
        xmlRequest.setRequestHeader("Content-Type", "application/json");

        let range = <HTMLInputElement>document.getElementById(`range_${id}`);
        let currentValue = parseInt(range.value)

        let s = {
            id: id,
            value: currentValue
        };//el json a enviar en el body del post

        xmlRequest.send(JSON.stringify(s));
    }

    private eliminarDispositivo(id: number) {
        console.log("se pega a ", `http://localhost:8000/devices/:${id}`);

        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("respuesta del backend", xmlRequest.responseText);
                } else {
                    alert("request delete fallido");
                }
            }
        }

        xmlRequest.open("DELETE", `http://localhost:8000/devices/${id}`, true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        xmlRequest.send();

        this.manipularLista();
    }

    private agregarDispositivo(): void {
        let iNombre = <HTMLInputElement>document.getElementById("iNombre");
        let iDescripcion = <HTMLInputElement>document.getElementById("iDescripcion");
        let iTipo = <HTMLSelectElement | null>document.querySelector('select');
        let pInfo = document.getElementById("pInfo");
        // Verifica si los campos requeridos están completados
        if (iNombre.value.trim() === "" || !iTipo || iTipo.value === "") {
            // Muestra un mensaje de error o realiza la lógica que desees
            pInfo.innerText = "Asegurate de completar los campos Nombre y Tipo";
            pInfo.className = "textoError";
        } else {
            // Si todo está bien, toma los valores, limpia el contenido de los campos y cierra el modal
            let dispositivo1: Device = new Device(iNombre.value, iDescripcion.value, iTipo.value, 0);
            this.dispositivos.push(dispositivo1);
            iNombre.value = "";
            iDescripcion.value = "";
            iTipo.value == "";

            pInfo.innerText = "Dispositivo agregado correctamente";
            pInfo.className = "textoCorrecto";
            M.Modal.getInstance(document.getElementById('modal1')).close();
            pInfo.innerText = "";

            console.log(dispositivo1.mostrar());
        }
    }

    private pruebaPost() {
        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    alert("llego respuesta del servidor: " + xmlRequest.status + ", " + xmlRequest.responseText);
                } else {
                    alert("Salio mal la consulta");
                }
            }
        }

        xmlRequest.open("POST", "http://localhost:8000/device", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        xmlRequest.send();
    }

    handleEvent(object: Event): void {
        let elemento = <HTMLElement>object.target;


        if ("btnListar" == elemento.id) {
            this.manipularLista();
        }
        else if ("btnGuardar" == elemento.id) {
            this.agregarDispositivo();
        }
        else if ("sendPost" == elemento.id) {
            this.pruebaPost();
        }else if (elemento.id.startsWith("range_")) {
            let range = <HTMLInputElement>elemento;
            console.log("deviceId: "+range.getAttribute("deviceId"));
            this.ejecutarPutRange(parseInt(range.getAttribute("deviceId")));
        }
        else if (elemento.id.startsWith("cb_")) {
            let checkbox = <HTMLInputElement>elemento;
            console.log(checkbox.getAttribute("deviceId"));
            this.ejecutarPutCB(parseInt(checkbox.getAttribute("deviceId")));
        }
        else if (elemento.id.startsWith("eliminar_")) {
            let eliminar = <HTMLInputElement>elemento;
            this.eliminarDispositivo(parseInt(eliminar.getAttribute("eliminarDeviceId")));
        }

    }

}


window.addEventListener("load", () => {

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, "");
    var elemsModal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsModal, "");

    let main1: Main = new Main();

    let botonListar = document.getElementById("btnListar");
    botonListar.addEventListener("click", main1);

    let botonGuardar = document.getElementById("btnGuardar");
    botonGuardar.addEventListener("click", main1);

    let sendPost = document.getElementById("sendPost");
    sendPost.addEventListener("click", main1);

    //let checkbox = document.getElementById("cb");
    //checkbox.addEventListener("click", main1);



});
