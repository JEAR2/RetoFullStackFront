const d = document,
$container = d.querySelector("#container"),
$ul = d.querySelector("ul"),
$fragment = d.createDocumentFragment();
const $template = d.getElementById("crud-template").content;
const $form = d.querySelector(".crud-form");
const description = $template.querySelector(".description");
const $send = $template.querySelector(".btnSendTask")

const getAll = async ()=>{
    let ids=`<h6>ID</h6>`;
    let tasks = `<h6>Tarea</h6>`;
    let complete = '';
    let buttonEdit = `<br>`;
    let buttonDelete = `<br>`;
   
    try {
        let res = await fetch("http://localhost:8080/list"),
        json = await res.json();
        if(!res.ok) throw {status:res.status, statusText: res.statusText};

        json.forEach( element =>  {
            description.classList.remove(`desc${element.id-1}`);
            $send.classList.remove(`c${element.id-1}`)
           $template.querySelector(".card-header").innerHTML = `<h5 class="name">${element.name}</h5>`;
           $template.querySelector(".card-header").innerHTML += `<button  type="button" class="btnDelList btn btn-danger btn-circle " dataset.id=${element.id}>Eliminar</i></button>`;
         
            element.tasks.forEach(elementTask =>{
            if(elementTask.complete){
            ids += `<p id=idt${elementTask.id} dataset.id='idt${elementTask.id}' style="text-decoration: line-through;">${elementTask.id}</p>`;
            tasks += `<p id='dst${elementTask.id}' dataset.id='dst${elementTask.id}' style="text-decoration: line-through;">${elementTask.description}</p>`;
            }else{
                ids += `<p id=idt${elementTask.id} dataset.id='idt${elementTask.id}' >${elementTask.id}</p>`;
            tasks += `<p id='dst${elementTask.id}' dataset.id='dst${elementTask.id}'>${elementTask.description}</p>`;
            }
            if(!elementTask.complete){
                complete += `<label class="btn btn-secondary btn-complete " id='com${elementTask.id}' dataset.id=${elementTask.id}>
                <input type="checkbox" checked autocomplete="off" > Completar
                </label>`;
            }else{
                complete += `<label class="btn btn-secondary btn-complete active" id='com${elementTask.id}' dataset.id=${elementTask.id}>
                <input type="checkbox" checked autocomplete="off" > Completado
                </label>`;
            }
           
            buttonEdit += `<button type="button" class="edit btn btn-warning" dataset.idList=${element.id} dataset.id='${elementTask.id}' dataset.description ='${elementTask.description}' dataset.complete='${elementTask.complete}'>Editar</button>`;
           
            buttonDelete += `<button type="button" class="deleteTask btn btn-danger" dataset.id='${elementTask.id}'>Eliminar</button>`; 
           });
           description.id=element.id;
           $send.id=(`c${element.id}`)
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

             let $clone = d.importNode($template,true);
             $fragment.appendChild($clone);
        });
        $container.appendChild($fragment);
    } catch (error) {
        let message = error.statusText || "ocurri?? un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
}

//Para ver los datos de la api (Se hace el llamado a la funcion getAll donde se encuentra la l??gica para obtener los datos)
d.addEventListener("DOMContentLoaded",getAll);

const btdAdd = d.querySelector(".btdAdd");
const ListName = d.querySelector(".nameList");
btdAdd.addEventListener("click", async (e)=>{
    e.preventDefault();
    try {
       
        let options = {
            method : "POST",
            headers : {
                "Content-type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify({
                name : ListName.value,
            })
        }, res = await fetch("http://localhost:8080/list",options),
            json = await res.json();
            if(!res.ok) throw {status:res.status, statusText: res.statusText};

            location.reload();
    } catch (error) {
        let message = error.statusText || "ocurri?? un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
})

const btnSendTask = d.querySelector(".btnSendTask");
btnSendTask.addEventListener("click", async (e)=>{
    e.preventDefault();
    const descriptionCurrent = d.getElementById(`${e.target.getAttribute("dataset.idList")}`);
    try {
       
        let options = {
            method : "PUT",
            headers : {
                "Content-type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify({
                description : descriptionCurrent.value,
                complete: false,
               // constelacion : e.target.constelacion.value
            })
        }, res = await fetch(`http://localhost:8080/task/update/${e.target.getAttribute("dataset.idList")}`,options),
            json = await res.json();
            if(!res.ok) throw {status:res.status, statusText: res.statusText};

            location.reload();
    } catch (error) {
        let message = error.statusText || "ocurri?? un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
})



let update = async (data)=>{
    try {
       
        let options = {
            method : "PUT",
            headers : {
                "Content-type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify({
                description : data.description,
                complete: !data.complete
               // constelacion : e.target.constelacion.value
            })
        }, res = await fetch(`http://localhost:8080/task/update/${data.id}`,options),
            json = await res.json();
            if(!res.ok) throw {status:res.status, statusText: res.statusText};

           //location.reload();
    } catch (error) {
        let message = error.statusText || "ocurri?? un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
}


d.addEventListener("click",async e=>{
    e.preventDefault();

    
    let s = e.target;
    let id = e.target.getAttribute("dataset.id");

    if(s.matches(".btnDelList")){
        let isDelete = confirm(`??Est??s seguro de eliminar el id ${id}?`);

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
                let message = error.statusText || "ocurri?? un error";
                alert(`Error ${error.status}: ${message}`);
            }
        }
    }

     if(s.matches(".deleteTask")){
        let isDelete = confirm(`??Est??s seguro de eliminar el id ${id}?`);

        if(isDelete){
            try {
                let options = {
                    method : "DELETE",
                    headers : {
                        "Content-type" : "application/json; charset=utf-8"
                    }
                }, res = await fetch(`http://localhost:8080/task/${id}`,options);
                    if(!res.ok) throw {status:res.status, statusText: res.statusText};
    
                    location.reload();
            } catch (error) {
                let message = error.statusText || "ocurri?? un error";
                alert(`Error ${error.status}: ${message}`);
            }
        }
    }

    
    if(s.matches(".btnSendTask")){
        const $send = d.querySelector(".btnSendTask ");
        if($send.textContent==""){
            const descriptionCurrent = d.getElementById(`${e.target.dataset.id}`);
                try {
               
                    let options = {
                        method : "POST",
                        headers : {
                            "Content-type" : "application/json; charset=utf-8"
                        },
                        body : JSON.stringify({
                            description : descriptionCurrent.value,
                            complete: false,
                            list:{id:e.target.dataset.id}
                        })
                    }, res = await fetch("http://localhost:8080/task",options),
                        json = await res.json();
                        if(!res.ok) throw {status:res.status, statusText: res.statusText};
            
                        location.reload();
                } catch (error) {
                    let message = error.statusText || "ocurri?? un error";
                    $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
                }
            
        }else{
            const descriptionCurrent = d.getElementById(`${e.target.dataset.id}`);
            try {
               
                let options = {
                    method : "PUT",
                    headers : {
                        "Content-type" : "application/json; charset=utf-8"
                    },
                    body : JSON.stringify({
                        description : descriptionCurrent.value,
                        complete: false
                       // constelacion : e.target.constelacion.value
                    })
                }, res = await fetch(`http://localhost:8080/task/update/${$form.id.value}`,options),
                    json = await res.json();
                    if(!res.ok) throw {status:res.status, statusText: res.statusText};
        
                    location.reload();
            } catch (error) {
                let message = error.statusText || "ocurri?? un error";
                $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
            }
        }
    }
        

    
    if(s.matches(".edit")){
        const descriptionCurrent = d.getElementById(`${e.target.getAttribute("dataset.idList")}`);
        const $sende =d.getElementById(`c${e.target.getAttribute("dataset.idList")}`);
        $sende.textContent = "Editar"
        descriptionCurrent.value = e.target.getAttribute("dataset.description")
        $form.id.value =e.target.getAttribute("dataset.id")
    }

    if(s.matches(".btn-complete")){
        const id = d.getElementById(`idt${e.target.getAttribute("dataset.id")}`)
        const desc = d.getElementById(`dst${e.target.getAttribute("dataset.id")}`)
        const complete = d.getElementById(`com${e.target.getAttribute("dataset.id")}`)
        complete.classList.add("active")
        complete.textContent = "Completado"

        try {
               
            let options = {
                method : "GET",
                headers : {
                    "Content-type" : "application/json; charset=utf-8"
                }
            }, res = await fetch(`http://localhost:8080/task/${e.target.getAttribute("dataset.id")}`,options),
                json = await res.json();
                if(json.complete){
                    complete.classList.remove("active")
                    complete.textContent = "Completar"
                    id.style.textDecoration=""
                    desc.style.textDecoration=""
                    update(json);
                }else{
                    complete.classList.add("active")
                    complete.textContent = "Completado"
                    id.style.textDecoration="line-through"
                    desc.style.textDecoration="line-through"
                    update(json);
                }
                if(!res.ok) throw {status:res.status, statusText: res.statusText};
    
               // location.reload();
        } catch (error) {
            let message = error.statusText || "ocurri?? un error";
            $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
        }
    }

})

