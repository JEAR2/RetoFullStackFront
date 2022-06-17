const inputNameList = document.createElement("input");
inputNameList.type="text";
inputNameList.name="nombreLista";
inputNameList.placeholder = "Ingrese el n ombre de la nueva lista";
inputNameList.required=true;
//inputNameList.classList.add("form-control");

const inputSend = document.createElement("input");
inputSend.type = "submit";
//inputSend.classList.add("btn");
//inputSend.classList.add("btn-success");
inputSend.value = "Enviar";

const inputHidden = document.createElement("input");
inputHidden.type = "hidden";
inputHidden.name = "id";


const container = document.querySelector("#container");

//container.append(inputNameList,inputSend,inputHidden);