const LOCALSTORAGE_KEY= "tarefas"

const elTitulo = document.querySelector("h1")
const elFiltro = document.getElementById("filtro")
const elTarefas = document.getElementById("tarefas")
const elNovaTarefa = document.getElementById("nova-tarefa")
const elCriar = document.getElementById("criar")

let tarefas=[]

function montar(tarefas){
    elTarefas.innerHTML =""
            tarefas.forEach((tarefa)=>{
                const elItem = document.createElement("li")
                elItem.classList.add(tarefa.completa ? "completa":"pendente")
                
                const elDescricao = document.createElement("span")
                elDescricao.classList.add("descricao")
                elDescricao.innerText =tarefa.descricao

                const elStatus =document.createElement("span")
                elStatus.classList.add("status")
                elStatus.textContent= tarefa.completa ? "Feita" : "A fazer"

                const elApagar = document.createElement("button")
                elApagar.classList.add("apagar")
                elApagar.innerText ="Apagar"

                elItem.appendChild(elDescricao)
                elItem.appendChild(elStatus)
                elItem.appendChild(elApagar)

                elStatus.addEventListener('click',()=>statusTarefa(tarefa.id, !tarefa.completa))
                elApagar.addEventListener('click',(evt)=>{
                    evt.stopPropagation()
                    apagarTarefa(tarefa.id)})
                       
                    elItem.addEventListener('dblclick', () => {
                        const entradaNovaDescricao = document.createElement("input")
                        entradaNovaDescricao.value = tarefa.descricao
                        entradaNovaDescricao.classList.add("atualizacao")
                        elDescricao.innerHTML = ""
                        elDescricao.appendChild(entradaNovaDescricao)
                        
                        entradaNovaDescricao.focus()
                    
                        entradaNovaDescricao.addEventListener('blur', () => {
                            const novaDescricao = entradaNovaDescricao.value.trim()
                            if (novaDescricao && novaDescricao !== tarefa.descricao) {
                                tarefa.descricao = novaDescricao
                                atualizarTarefa(tarefa.id, tarefa.descricao)
                            }
                            elDescricao.innerText = tarefa.descricao
                        })
                    
                        entradaNovaDescricao.addEventListener('keydown', (evt) => {
                            if (evt.key === "Enter") {
                                entradaNovaDescricao.blur() 
                            
                            }
                        })
                    })
                
                
                elTarefas.appendChild(elItem)
                
            })           
}


async function carregar(){
    try{
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)??'[]')
        
        await montar(tarefas)         
       
    }catch{
        console.error("Falha no status tarefas. Erro na rede.")
    }   
}

async function criarTarefa(descricao){
    try{
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)??'[]')
        tarefas.push({
            id:Date.now(),
            descricao,
            completa:false
        })
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tarefas)) 
       
            elNovaTarefa.value= ''
            await carregar()       
       
    }catch{
        console.error("Falha ao carregar tarefas. Erro na rede.")
    }
}
async function statusTarefa(id,completa){
    try{
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)??'[]')
        const index = tarefas.findIndex(tarefa =>tarefa.id == id)
        if(index>=0){
            tarefas[index].completa = completa
            localStorage.setItem(LOCALSTORAGE_KEY,JSON.stringify(tarefas))
            await carregar()
        }else{
            console.error("Erro ao trocar o status da tarefa.")
        }
    }catch{
        console.error("Falha ao carregar tarefas. Erro na rede.")
    }
}

async function apagarTarefa(id){
    try{
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)??'[]')
        const index = tarefas.findIndex(tarefa =>tarefa.id == id)
        if(index>=0){
            tarefas.splice(index,1)
            localStorage.setItem(LOCALSTORAGE_KEY,JSON.stringify(tarefas))
            await carregar()
        }else{
            console.error("Erro ao apagar o status da tarefa.")
        }
    }catch{
        console.error("Falha ao apagar tarefas. Erro na rede.")
    }
}
async function atualizarTarefa(id,descricao){

    try{
        tarefas = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)??'[]')
        const index = tarefas.findIndex(tarefa =>tarefa.id == id)
        if(index >= 0){
            tarefas[index].descricao = descricao
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tarefas))
            await carregar()
        }
        else{
            console.error("Erro ao atualizar a tarefa.")
        }
    }catch{
        console.error("Falha ao aatualizar a tarefa. Erro na rede.")
    }
}

elFiltro.addEventListener('input',(event)=>{
    const filtro = event.target.value.toLowerCase()
    const tarefasFiltradas =tarefas.filter(
        tarefa=> tarefa.descricao.toLowerCase().includes(filtro)
    )
    montar(tarefasFiltradas)
})

elCriar.addEventListener('click',(evento) =>{
    const novaTarefa = elNovaTarefa.value.trim()
    if(novaTarefa!==""){
        criarTarefa(novaTarefa)
    }
})

elTitulo.addEventListener('click',()=>{

    const temaAtual = document.body.attributes["data-theme"].value
    if(temaAtual==="purple"){
        document.body.attributes["data-theme"].value="orange"
    }else if(temaAtual==="orange"){
        document.body.attributes["data-theme"].value="pink"
    }else if(temaAtual==="pink"){
        document.body.attributes["data-theme"].value="purple"
    }
})

window.onload =carregar