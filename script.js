const itemForm = document.getElementById('item-form');  //formulário geral
const itemInput = document.getElementById('item-input'); //único input dentro do form
const itemList = document.getElementById('item-list');    //todo o ul

//----------------function addItem-------------------------------
function addItem(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    //validate input
    if (newItem === ''){
        alert('Please add a item');
        return;
    }


//create list Item
const li = document.createElement('li');
li.appendChild(document.createTextNode(newItem));

const button = createButton('remove-item btn-link text-red'); //o icone append vai ser chamado por createbutton()
li.appendChild(button); //append a função const button(function createButton), que por sua vez fez o 
//append de const icon, dentro de (function createIcon)

//coloca o li com os seus appends criados em outras funções, dentro do ul
itemList.appendChild(li);

//limpa o único input dentro de form, após todo o processo.
itemInput.value = '';

console.log(li);
}

    //--function cria botão (function addItem(e) acima, chama essa função e passa as classes)-----------------
    function createButton(classes) {
        const button = document.createElement('button');
        button.className = classes;
        //antes de retornar, chama o icone, passa as classes e faz o append
        const icon = createIcon('fa-solid fa-plus'); //para passar parametros, tem ''?
        button.appendChild(icon);
        return button;
    }
    
    //--função cria um icone
    function createIcon (classes) {
        const icon = document.createElement('i');
        icon.className = classes; //icon tem o append de classes, não o 'i'
        return icon;
    }
     



//add event listeners
itemForm.addEventListener('submit', addItem);