
var M;
class Main implements EventListenerObject{
    public dispositivos: Array<Device>= new Array<Device>();


    private buscarPersonas() {
        for (let u of this.dispositivos) {
            console.log(u.mostrar(),this.dispositivos.length);
        }
    }
    
    private getDevices() {

        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {

            if (xmlRequest.readyState == 4) {
                if(xmlRequest.status==200){
                    console.log(xmlRequest.responseText, xmlRequest.readyState);
                    let respuesta = xmlRequest.responseText;
                    let datos:Array<Device> = JSON.parse(respuesta);

                    let ul = document.getElementById("listaDisp");

                    for (let d of datos) {
                        let itemList =
                            ` <li class="collection-item avatar">
                        <img src="./static/images/lightbulb.png" alt="" class="circle">
                        <span class="title">${d.name}</span>
                        <p>
                         ${d.description}
                        </p>
                        <a href="#!" class="secondary-content">
                        <div class="switch">
                        <label>
                          Off
                          <input type="checkbox"`;
                        itemList +=`deviceId="${d.id}" id="cb_${d.id}"`
                        if (d.value) {
                            itemList+= ` checked `
                        }

                        itemList+= `>
                          <span class="lever"></span>
                          On
                        </label>
                      </div>
                        </a>
                      </li>`

                        ul.innerHTML += itemList;

                    }
                    for (let d of datos) {
                        let checkbox = document.getElementById("cb_" + d.id);

                        checkbox.addEventListener("click", this);
                    }

                }else{
                    console.log("no encontre nada");
                }
            }

        }
        xmlRequest.open("GET","http://localhost:8000/devices",true)
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

        if (ul && ul.childElementCount === 0) {
            // Si la lista está vacía, mostrar y cambiar el botón a "Ocultar"
            this.getDevices();
            botonListar.innerText = "Ocultar";
        } else {
            // Si la lista está llena, ocultar y cambiar el botón a "Listar"
            this.borrarDevices();
            botonListar.innerText = "Listar";
        }
    }

    private ejecutarPost(id: number, state: boolean) {
        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("llego resputa",xmlRequest.responseText);
                } else {
                    alert("Salio mal la consulta");
                }
            }
        }      

        xmlRequest.open("POST", "http://localhost:8000/device", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        
        let s = {
            id: id,
            state: state   }; //el json a enviar en el body del post
        xmlRequest.send(JSON.stringify(s));
    }

    private agregarDispositivo(): void{
        let iNombre =<HTMLInputElement> document.getElementById("iNombre");
        let iDescripcion =<HTMLInputElement> document.getElementById("iDescripcion");
        let iTipo = <HTMLSelectElement | null>document.querySelector('select');
        let pInfo = document.getElementById("pInfo");
        // Verifica si los campos requeridos están completados
        if (iNombre.value.trim() === "" || !iTipo || iTipo.value === "") {
            // Muestra un mensaje de error o realiza la lógica que desees
            pInfo.innerText = "Asegurate de completar los campos Nombre y Tipo";
            pInfo.className ="textoError";
        } else {
            // Si todo está bien, toma los valores, limpia el contenido de los campos y cierra el modal
            let dispositivo1: Device = new Device(iNombre.value, iDescripcion.value, iTipo.value, 0);
            this.dispositivos.push(dispositivo1);
            iNombre.value = "";
            iDescripcion.value = "";
            iTipo.value == "";

            pInfo.innerText = "Dispositivo agregado correctamente";
            pInfo.className ="textoCorrecto";
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
                    alert("llego respuesta del servidor: "+ xmlRequest.status+ ", " + xmlRequest.responseText);
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
        } else if ("btnGuardar" == elemento.id) {
            this.agregarDispositivo();
        }else if ("sendPost" == elemento.id){
            this.pruebaPost();
        } else if (elemento.id.startsWith("cb_")) {
            let checkbox = <HTMLInputElement>elemento;
            console.log(checkbox.getAttribute("deviceId"),checkbox.checked, elemento.id.substring(3, elemento.id.length));

            this.ejecutarPost(parseInt(checkbox.getAttribute("deviceId")),checkbox.checked);
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
