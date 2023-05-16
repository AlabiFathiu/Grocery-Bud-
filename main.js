// DOM Extraction
const Alert = document.getElementById('alert');
const input = document.getElementById('input')
const groceryForm = document.getElementById('grocery');
const groceryContainer = document.querySelector('.grocery-container');
const groceryItem = document.querySelector('.grocery-item');
const groceryList = document.querySelector('.grocery-list');
const clearItems = document.getElementById('clear-items');
const submit = document.getElementById('submit');

// Set Edit Option
let editFlag = false;
let editElement;
let editId = '';

// list for a click on submit on the form
groceryForm.addEventListener('submit', addItem) 
    
// Clear Items
clearItems.addEventListener('click', clearItem)

// DOM Content Loaded
window.addEventListener('DOMContentLoaded', setUpItems)


// AddItem function
function addItem(e) {
    // Prevent Submit
    e.preventDefault()
    // Get inputValue
    const groceryInput = input.value;
    // Create a unique Id
    const id = new Date().getTime().toString()
    
    // create an If statement
    // If input is not empty and we arent editing
    if(groceryInput !== "" && !editFlag) {
        // create a new Element
        const newElement = document.createElement('article');
        // set a class 
        newElement.classList.add('grocery-list')
        // Create an attribute value and set it = data-id
        let attr = document.createAttribute('data-id')
        // set the attribute value = id
        attr.value = id;
        // set the newElemet attributeNode = attribute
        newElement.setAttributeNode(attr)
        // Display the new element in the HTML 
        newElement.innerHTML = `<p class="title">${groceryInput}</p>
                                    <div class="btn-container">
                                        <!-- Edit-Btn -->
                                            <button class="edit-btn" id="edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <!-- Delete Btn -->
                                            <button class="delete-btn" id="delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                    </div>`
        // Target the edit and deleteBtn
        const editBtn = newElement.querySelector('.edit-btn');
        const deleteBtn = newElement.querySelector('.delete-btn');
        // Listen for a Click
        editBtn.addEventListener('click', editItem)
        deleteBtn.addEventListener('click', deleteItem)
        // append the newElement to the groceryItem
        groceryItem.appendChild(newElement)
        // adda class of show-container to the groceryContainer
        groceryContainer.classList.add('show-container')
        // display alert
        displayAlert('Item Added', 'success');
        // Add to local storage
        addToLocalStorage(id, groceryInput);
        // Set Back to default
        setBackToDefault()
        
    }
    // If input is not empty and we are editing
    else if (groceryInput !== "" && editFlag) {
        editElement.innerHTML = groceryInput;
        // DisplayAlert
        displayAlert('value changed', 'success')
        // edit local storage()
        editLocalStorage(editId, groceryInput)
        // setBackToDefault
        setBackToDefault()
    }
    // If the imput field is Empty
    else {
        displayAlert("Please Enter Fields", "danger")   
    }
}

// Display Alert function
function displayAlert(text, action) {
    // Alert Text
    Alert.textContent = text
    // Alert action
    Alert.classList.add(`alert-${action}`)

    // Remove alert after 1sec
    setTimeout(function() {
        Alert.textContent = "";
        Alert.classList.remove(`alert-${action}`)
    }, 1000)
}

// Set Back to default
function setBackToDefault() {
    input.value = "";
    editFlag = false;
    editId = "";
    submit.textContent = 'submit';
}

// Clear Items
function clearItem() {
    const groceryList = document.querySelectorAll('.grocery-list');

    if (groceryList.length > 0) {
        groceryList.forEach(item => {
            groceryItem.removeChild(item)
        })
    }
    alert('Are you sure you want to clear all items')
    // remove the groceryContainer class of show-container
    groceryContainer.classList.remove('show-container')
    // Display Alert
    displayAlert('Items Cleared', 'danger')
    // setBack to default
    setBackToDefault()
    // remove item totally from localStorage
    localStorage.removeItem('list')
}


// Remove an Item
function deleteItem(e) {
    // Taget the parentElement
    const removeItem = e.currentTarget.parentElement.parentElement
    // target the id
    const  id = removeItem.dataset.id
    // show an alert message
    let confirmAction = confirm('Are you sure you want to delete this item?')
    if(confirmAction) {
        // Delete the newElement from the parentElement using removeChild
        groceryItem.removeChild(removeItem)
        // displayAlert
        displayAlert('Item Removed', 'danger')
    } else {
        alert('Action Canceled')
    }
    
    // Remove Show Container
    if(groceryItem.children.length === 0) {
        // Remove showContainer
        groceryContainer.classList.remove('show-container')
    }
    // set back to defaulu
    setBackToDefault()
    // removeLocalStorage
    removeFromLocalStorage(id)
}

// Edit Element
function editItem (e) {
     // Taget the parentElement for the deleteItem
     const removeItem = e.currentTarget.parentElement.parentElement
    //  Target the parentElemet for the editItem
     editElement = e.currentTarget.parentElement.previousElementSibling;

    // set the input value to editElement
    input.value = editElement.innerHTML
    editFlag = true;
    editId = removeItem.dataset.id;
    submit.textContent = 'edit';
}

// Local Storage Api
function getLocalStorage() {
    return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

// ADD to Local Storage
function addToLocalStorage(id, groceryInput) {
    const grocery = {id:id, groceryInput:groceryInput}
    let items = getLocalStorage();
    // To Add a New Item
    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items))
}

// Remove Local Storage
function removeFromLocalStorage(id) {
    let items = getLocalStorage()
    // Filter out items using filter()
    items.filter(item => {
        if(item.id !== id) {
            return item
        }
        localStorage.setItem('list', JSON.stringify(items))
    })
}

// Edit Local Storage
function editLocalStorage(id, groceryInput) {
    let items = getLocalStorage();
    // Create a new array using map()
    items.map(item => {
        if(item.id === id) {
            item.groceryInput = groceryInput
        }
        return item
    })
    localStorage.setItem('list', JSON.stringify(items))
}

// SetUpItems
function setUpItems() {
    // get Local Storage
    let items = getLocalStorage()
    if(items.length > 0) {
        items.forEach(item => {
            createListItem(item.id, item.groceryInput)
        })
        groceryContainer.classList.add('show-container')
    }
}

function createListItem (id, groceryInput) {
           // create a new Element
           const newElement = document.createElement('article');
           // set a class 
           newElement.classList.add('grocery-list')
           // Create an attribute value and set it = data-id
           let attr = document.createAttribute('data-id')
           // set the attribute value = id
           attr.value = id
           // set the newElemet attributeNode = attribute
           newElement.setAttributeNode(attr)
           // Display the new element in the HTML 
           newElement.innerHTML = `<p class="title">${groceryInput}</p>
                                       <div class="btn-container">
                                           <!-- Edit-Btn -->
                                               <button class="edit-btn" id="edit">
                                                   <i class="fas fa-edit"></i>
                                               </button>
                                               <!-- Delete Btn -->
                                               <button class="delete-btn" id="delete">
                                                   <i class="fas fa-trash"></i>
                                               </button>
                                       </div>`
           // Target the edit and deleteBtn
           const editBtn = newElement.querySelector('.edit-btn');
           const deleteBtn = newElement.querySelector('.delete-btn');
           // Listen for a Click
           editBtn.addEventListener('click', editItem)
           deleteBtn.addEventListener('click', deleteItem)
           // append the newElement to the groceryItem
           groceryItem.appendChild(newElement)
}
