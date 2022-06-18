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
   // let deleteList =  `<button  type="button" class="btnDelList btn btn-danger "><i class="fa fa-times" aria-hidden="true"></i>`
    try {
        let res = await fetch("http://localhost:8080/list"),
        json = await res.json();
        if(!res.ok) throw {status:res.status, statusText: res.statusText};

        console.log(json)
        json.forEach( element =>  {
            description.classList.remove(`desc${element.id-1}`);
            $send.classList.remove(`c${element.id-1}`)
           $template.querySelector(".card-header").innerHTML = `<h5 class="name">${element.name}</h5>`;
           $template.querySelector(".card-header").innerHTML += `<button  type="button" class="btnDelList btn btn-danger btn-circle " dataset.id=${element.id}>Eliminar</i></button>`;
           console.log(element.tasks)
            element.tasks.forEach(elementTask =>{
            console.log("id ",elementTask.id)
            ids += `<p>${elementTask.id}</p>`;
            tasks += `<p>${elementTask.description}</p>`;
            if(complete){
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

const btnSendTask = d.querySelector(".btnSendTask");
btnSendTask.addEventListener("click", async (e)=>{
    alert("dasdsa")
    e.preventDefault();
    const descriptionCurrent = d.getElementById(`${e.target.getAttribute("dataset.idList")}`);
    console.log("dadsd ",descriptionCurrent)
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
            console.log(res)
            if(!res.ok) throw {status:res.status, statusText: res.statusText};

            location.reload();
    } catch (error) {
        let message = error.statusText || "ocurrió un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
})



let update = async (data)=>{
    alert("entró")
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
            console.log("result ",res)
            if(!res.ok) throw {status:res.status, statusText: res.statusText};

            location.reload();
    } catch (error) {
        let message = error.statusText || "ocurrió un error";
        $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
    }
}


d.addEventListener("click",async e=>{
    e.preventDefault();
    console.log(e.target.dataset.id || e.target.getAttribute("dataset.idList"))

    
    let s = e.target;
    let id = e.target.getAttribute("dataset.id");

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

     if(s.matches(".deleteTask")){
        let isDelete = confirm(`¿Estás seguro de eliminar el id ${id}?`);

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
                let message = error.statusText || "ocurrió un error";
                alert(`Error ${error.status}: ${message}`);
            }
        }
    }

    
    if(s.matches(".btnSendTask")){
        const $send = d.querySelector(".btnSendTask ");
        if($send.textContent=="Enviar"){
            const descriptionCurrent = d.getElementById(`${e.target.dataset.id}`);
                console.log("1 ",descriptionCurrent.value)
                console.log("2 ",e.target.dataset.id)
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
                        console.log(res)
                        if(!res.ok) throw {status:res.status, statusText: res.statusText};
            
                        location.reload();
                } catch (error) {
                    let message = error.statusText || "ocurrió un error";
                    $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
                }
            
        }else{
            const descriptionCurrent = d.getElementById(`${e.target.dataset.id}`);
            console.log("dadsd ",descriptionCurrent.value)
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
                    console.log(res)
                    if(!res.ok) throw {status:res.status, statusText: res.statusText};
        
                    location.reload();
            } catch (error) {
                let message = error.statusText || "ocurrió un error";
                $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
            }
        }
    }
        

    
    if(s.matches(".edit")){
        const descriptionCurrent = d.getElementById(`${e.target.getAttribute("dataset.idList")}`);
        console.log(`c${e.target.getAttribute("dataset.idList")}`)
        const $sende =d.getElementById(`c${e.target.getAttribute("dataset.idList")}`);
        console.log("s ",$sende)
        $sende.textContent = "Editar"
        descriptionCurrent.value = e.target.getAttribute("dataset.description")
        $form.id.value =e.target.getAttribute("dataset.id")
    }

    if(s.matches(".btn-complete")){
        console.log(e.target.getAttribute("dataset.id"))
        const complete = d.getElementById(`com${e.target.getAttribute("dataset.id")}`)
        console.log(`com${e.target.getAttribute("dataset.id")}`)
        console.log(complete)
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
                console.log(json)
                if(json.complete){
                    complete.classList.remove("active")
                    complete.textContent = "Completar"
                }else{
                    alert("else")
                    complete.classList.add("active")
                    complete.textContent = "Completado"
                }
                update(json);
                if(!res.ok) throw {status:res.status, statusText: res.statusText};
    
                //location.reload();
        } catch (error) {
            let message = error.statusText || "ocurrió un error";
            $container.insertAdjacentHTML("afterend",`<p><b>Error ${error.status}: ${message}</b></p>`);
        }
    }

})

