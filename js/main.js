const d = document,
$container = d.querySelector("#container"),
$ul = d.querySelector("ul"),
$fragment = d.createDocumentFragment();
const $template = d.getElementById("crud-template").content;

const description = $template.querySelector(".description");


const getAll = async ()=>{
    let ids=`<h6>ID</h6>`;
    let tasks = `<h6>Tarea</h6>`;
    let complete = '';
    let buttonEdit = `<br>`;
    let buttonDelete = `<br>`;
   // let deleteList =  `<button  type="button" class="btnDelList btn btn-danger btn-circle "><i class="fa fa-times" aria-hidden="true"></i>`
    try {
        let res = await fetch("http://localhost:8080/list"),
        json = await res.json();
        if(!res.ok) throw {status:res.status, statusText: res.statusText};

        console.log(json)
        json.forEach( element =>  {
           $template.querySelector(".card-header").textContent = element.name;
           $template.querySelector(".card-header").innerHTML += `<button  type="button" class="btnDelList btn btn-danger btn-circle " dataset.id=${element.id}>Eliminar</i></button>`;
         //  $template.querySelector(".card-header").innerHTML += deleteList;
           //$template.querySelector(".btnDelList").dataset.id = element.id;
           console.log(element.tasks)
            element.tasks.forEach(elementTask =>{
            console.log("id ",elementTask.id)
            ids += `<p>${elementTask.id}</p>`;
            tasks += `<p>${elementTask.description}</p>`;
            complete += `<label class="btn btn-secondary active">
                        <input type="checkbox" checked autocomplete="off"> Completar
                        </label>`;
            buttonEdit += `<button type="button" class="btn btn-warning">Editar</button>`;
            buttonDelete += `<button type="button" class="btn btn-danger">Eliminar</button>`; 
           });
           $template.querySelector(".idContent").innerHTML = ids;
           $template.querySelector(".taskContent").innerHTML = tasks;
           $template.querySelector(".complete").innerHTML = complete;
           $template.querySelector(".btnEdit").innerHTML = buttonEdit;
           $template.querySelector(".btnDelete").innerHTML = buttonDelete;
           $template.querySelector(".btnSendTask").dataset.id=element.id;
           ids=`<h6>ID</h6>`;
           tasks = `<h6>Tarea</h6>`;
           complete = '';
           buttonEdit = `<br>`;
           buttonDelete = `<br>`;
            // $template.querySelector(".edit").dataset.id = element.id;
            // $template.querySelector(".edit").dataset.name = element.name;
            // $template.querySelector(".delete").dataset.id = element.id;

             let $clone = d.importNode($template,true);
             $fragment.appendChild($clone);
        });
        $container.appendChild($fragment);
    } catch (error) {
        let message = error.statusText || "ocurrió un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
}

//Para ver los datos de la api (Se hace el llamado a la funcion getAll donde se encuentra la lógica para obtener los datos)
d.addEventListener("DOMContentLoaded",getAll);

const btdAdd = d.querySelector(".btdAdd");
const ListName = d.querySelector(".nameList");
btdAdd.addEventListener("click", async (e)=>{
    e.preventDefault();
    console.log("dadsd ",ListName.value)
    try {
       
        let options = {
            method : "POST",
            headers : {
                "Content-type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify({
                name : ListName.value,
               // constelacion : e.target.constelacion.value
            })
        }, res = await fetch("http://localhost:8080/list",options),
            json = await res.json();
            console.log(res)
            if(!res.ok) throw {status:res.status, statusText: res.statusText};

            location.reload();
    } catch (error) {
        let message = error.statusText || "ocurrió un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
})


d.addEventListener("click",async e=>{
    e.preventDefault();

    let s = e.target;
    let id = e.target.getAttribute("dataset.id");
    console.log(e)
    if(s.matches(".btnDelList")){
        let isDelete = confirm(`¿Estás seguro de eliminar el id ${id}?`);

        if(isDelete){
            try {
                let options = {
                    method : "DELETE",
                    headers : {
                        "Content-type" : "application/json; charset=utf-8"
                    }
                }, res = await fetch(`http://localhost:8080/list/${id}`,options);
                    if(!res.ok) throw {status:res.status, statusText: res.statusText};
    
                    location.reload();
            } catch (error) {
                let message = error.statusText || "ocurrió un error";
                alert(`Error ${error.status}: ${message}`);
            }
        }
    }



})

