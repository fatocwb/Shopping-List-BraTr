const itemForm = document.getElementById('item-form');  //formulário geral
const itemInput = document.getElementById('item-input'); //único input dentro do form
const itemList = document.getElementById('item-list');    //todo o ul
const clearBtn = document.getElementById('clear'); //botão clear
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button'); //botão pertencente ao formulário
let isEditMode = false;



//1----------------function display items-------------------------------
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  
  //Para cada item(nome genérico) dentro de itemsFromStorage, chamar addItemToDom e passar item (nome genérico)
  //somente até essa parte, quando F5 os itens do storage voltam à tela. 
  itemsFromStorage.forEach(item => {
    addItemToDom(item);
  });

  checkUI();
}

//2----------------function addItem-------------------------------
function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    //validate input
    if (newItem === ''){
        alert('Please add a item');
        return;
    }    


//create list Item
const li = document.createElement('li');
li.appendChild(document.createTextNode(newItem)); //o que for digitado sera appendChild de li

const button = createButton('remove-item btn-link text-red'); //o icone append vai ser chamado por createbutton()
li.appendChild(button); //append a variável const button(function createButton), que por sua vez fez o 
//append de const icon, dentro de (function createIcon)

//coloca o li com os seus appends criados em outras funções, dentro do ul
itemList.appendChild(li);

//check for edit mode
if (isEditMode) { //vai remover o velho e colocar o novo item, pois não é possível editar itens dentro de local storage, apenas set, get, remove
  const itemToEdit = itemList.querySelector('.edit-mode');

  removeItemFromStorage(itemToEdit.textContent);
  itemToEdit.classList.remove('edit-mode');
  itemToEdit.remove();
  isEditMode = false;
} else {
    if ( checkIfItemExists(newItem) ) {
        alert('That item already exists');
        return;
    }  
}

//add o item para a session storage (DOM). NewItem is coming from the form (#item-input)
//chamando a função addItemToDom(newItem); tanto dentro da função onAddItemSubmit quanto dentro da 
//função displayItems faz mostrar em duplicidade.
//addItemToDom(newItem);

//add items to local storage
addItemToStorage(newItem);

checkUI();

//limpa o único input dentro de form, após todo o processo.
itemInput.value = '';
}


//4--------------------------------function cria botão ----------------------------
// (function addItem(e) acima, chama essa função e passa as classes)   
function createButton(classes) { //recebe uma string de classes
    const button = document.createElement('button');
    button.className = classes;

    //antes de retornar(return button), chama createIcon, passa as classes e faz o append
    //Here, 'fa-solid fa-plus' is a single string that represents two CSS class names.  the quotes are used to create a single string argument with the desired class names
    const icon = createIcon('fa-solid fa-plus'); //para passar parametros, tem ''?
    button.appendChild(icon);

    return button;
    }
    
//5----------------função cria um icone-------------------------------------------------------------
function createIcon (classes) {
const icon = document.createElement('i');
icon.className = classes; //icon tem o append de classes, não o 'i'
return icon;
    }
     
//3-------------------function Add item to Dom and display --------------------------------------
function addItemToDom(item) {

    //Create list Item
    const li = document.createElement('li');
    //li.appendChild(document.createTextNode(item));
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    //add li to the DOM
    itemList.appendChild(li); //é sem apostrofo
   }

//6--------------------------------fuction storage ----------------------------
function addItemToStorage(item) { //nome genérico do argumento recebido

    const itemsFromStorage = getItemsFromStorage(); 
     
    //add new item to array, independently if itemsFromStorage tem elementos na array ou não
    itemsFromStorage.push(item);
    
    //convert to JSON string and set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));  //('key', value)
    
    }

//7-------------------------- display items from storage in array mode, if array don't exist will be created ------------------------------------
function getItemsFromStorage() {
    let itemsFromStorage; //represent the array of items in local storage, o uso de let é essencial. 
//como sei que itemsFromStorage é uma array?
 
//if statement para ver se há algo dentro, seja qual for o resultado, itemsFromStorage vai se tornar uma array
//Ou a itemsFromStorage vai ser uma array vazia, ou vai receber um objeto (que era uma string JSON)
if (localStorage.getItem('items') === null) { //de onde vem 'items' se não declarei essa variável? Poderia ser "newItem"?
    itemsFromStorage = [];
} else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items')); //significa que localStorage não é vazia e tem items dentro
    //"localStorage.getItem('items)" retorna string (value) (não JSON) com base na key 'items', depois ela é parsed in a object  
    //O JSON.parse transforma essa variável "let itemsFromStorage" numa array
}
return itemsFromStorage;
}

//----------------------------  função para remover um item do storage --------------------------------------------------------    
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
     removeItem(e.target.parentElement.parentElement);
    }
    else {
     setItemToEdit(e.target);
    }
}

//--------------------------- função para checar se um item existe ------------------------------------------------------------------
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    //return itemsFromStorage.includes(item);

    if (itemsFromStorage.includes(item)) {
        return true;
    }
    else {
        return false;
    }
}

//--------------------------- função para editar o item ----------------------------------------------------------
function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => {
        i.classList.remove('edit-mode') //o editado volta a ser preto e não cinza
    });

    item.classList.add('edit-mode'); //edit-mode foi criado
    formBtn.innerHTML = '<i classs="fa-solid fa-pen"></i> update item';
    formBtn.style.backgroundColor = '#228b22';
    itemInput.value = item.textContent; //pula para o input e adiciona novamente
}


//8-------------------------- função para remover um item ------------------------------------
function removeItem (item) {
if (confirm('Are you sure?')) {
    //remove item from DOM
    item.remove(); //remove o argumento recebido (e.target.parentElement.parentElement)
 
    //remove item from storage
    removeItemFromStorage(item.textContent);

    //quando todos o itens forem remvidos, remove o filtro e botão clear
    checkUI();
}

/* //console.log(e.target) >> retorna elementos clicados que pertencem ao ul. (e.target.remove() >> remove qualquer coisa clicada no ul)
      
//Funciona apenas IF o e.target clicado tem um parent com a classe 'remove-item'. Tudo isso só funciona dentro de ul
if (e.target.parentElement.classList.contains('remove-item')) {
if (window.confirm('Are you sure?')) {
e.target.parentElement.parentElement.remove();
            
        } 
       }  */
      }

//--------------------------- Função para remover itens  ---------------------------------------------------      
function removeItemFromStorage (item) { //esquecer de passar o item causa erros
   let itemsFromStorage = getItemsFromStorage(); //foi retornado um array vazio ou com itens

   //filter out items to be removed, remove só o que for filtrado
   itemsFromStorage = itemsFromStorage.filter((i) => i !== item ); //for each (i) i não deve ser igual ao item passado
 
   //reset to local storage
   localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


//9------------------------- função para limpar todos os itens -----------------------------
    function clearItems() {
     while (itemList.firstChild) //Enquanto o itemList (ul) tiver um firsChild
        {
          itemList.removeChild(itemList.firstChild);  //remova o firstChild de itemList (ul)
        }

       //clear from localstorage using botão clear
       localStorage.removeItem('items'); //usar apóstrofo

        //quando todos o itens forem remvidos, remove o filtro e botão clear
        checkUI();
    }

//10------------------ function filter items ---------------

    function filterItems(e) {
        const items = itemList.querySelectorAll('li');
        const text = e.target.value.toLowerCase();

        //é possível usar forEach pois é uma nodeList
        items.forEach( item => {
            const itemName = item.firstChild.textContent.toLowerCase();
            
            //Verifica se a variável itemName tem o mesmo texto que variável (text).
            //Se retornar qualquer valor diferente de (-1) a  condição é verdadeira
            //itemName.indexOf(text) retorna a posição da primeira ocorrência de text dentro de itemName. Se text não estiver presente, a função retorna -1.
            //logo se não encontrar nada, (-1 != -1)?Resposta: Não (false), e retorna else.
            if (itemName.indexOf(text) != -1) { //retirar o -1 retorna o else quando vazio o filter
              item.style.display = 'block'; //
            }else {
              item.style.display = 'none';
            }
        });
    }

//11------------------ function to see if there is items ---------------
    function checkUI() {
        itemInput.value = '';

    //Seleciona todos os 'li' dentro de ul(itemList). 
    //Deve estar aqui dentro para pegar os novos itens, vem redirecionado de addItem(), que já
    //tem items na memória. Se ficar no global, sempre vai dar 0
    const items = itemList.querySelectorAll('li'); //querySelector('li') houve um erro
    console.log(items);

     if (items.length === 0) { //se não houver li dentro de ul
        clearBtn.style.display = 'none'; // não mostra o botão clear
        itemFilter.style.display = 'none'; //não mostra o fitro
      }
      else {
        clearBtn.style.display = 'block'; //mostra o botã em blocos
        itemFilter.style.display = 'block';
      }
    
    //porque não backticks?  
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    
    isEditMode = false;
    }


function init() {
//add event listeners
itemForm.addEventListener('submit', onAddItemSubmit); //Não deveria ter o () no final de addItem?
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

//Mesmo se add itens, ainda assim o filtro e botão não vão aparecer
checkUI();
}

init();
//localStorage.clear();