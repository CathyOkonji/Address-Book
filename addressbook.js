
   const contactForm = document.forms.contactForm;
   const contactList = document.getElementById('contactList');

   const name = contactForm.elements.name;
   const email = contactForm.elements.email;
   const phoneNumber = contactForm.elements.phoneNumber;
   const addContactBtn = contactForm.elements.addContactBtn;

    let contactListState = [];

   let appState = { 
       isEdit: false,
       nodeToEdit: null,
       idEdit: null,
       updateList: null,
   } 

   const setLocalStorage = (contactListState) => {
    let contactListState_string = JSON.stringify(contactListState); 
        
    localStorage.setItem("contactListState", contactListState_string);
   }
      
   const addContact = (event) => {
        event.preventDefault();
        if (appState.isEdit === false) {
            const contact = {
                name: name.value,
                email: email.value,
                phoneNumber: phoneNumber.value,
                id: contactListState.length ? //is there any contact here? if yes,
                contactListState[contactListState.length - 1].id + 1 : //get the id of the last contact then add the new contact saved (reference to the "+1")
                 1 //else save the contact with id 1 since it is the first contact to be saved//
            } // ? : - tenary operator (short form of if/else)//
    
        const newContactItem = newContactElement(contact)
        contactList.appendChild(newContactItem);
        contactListState.push(contact);
        
     setLocalStorage(contactListState) //to reset the contacts saved in the localStorage//
        
        } else { 
            appState.nodeToEdit.firstChild.textContent = name.value; //run if edit finctionality//
            appState.nodeToEdit.lastChild.children[0].textContent = email.value;
            appState.nodeToEdit.lastChild.children[1].textContent = phoneNumber.value;

            const updatedContact = {
                ...appState.updateList,
                name: name.value,
                email: email.value,
                phoneNumber: phoneNumber.value
            }

            const updatedIndex = contactListState.findIndex((contact) => contact.id === appState.updateList.id);
            contactListState.splice(updatedIndex, 1, updatedContact);//splice can be used to delete or update a contact(which is what is happening here)

            setLocalStorage(contactListState) //since a contact was updated, this has to run again to update the local storage//
            
            
            appState = { // reset after editing//
                isEdit: false,
                nodeToEdit: null,
                idEdit: null,
                updateList: null,
            } 
            addContactBtn.value = "Add Now!"; //reset the value of the addContantBtn when it is to add a new contact//
        }

        name.value = "" //clears the input field after a contact has been edited//
        email.value = ""
        phoneNumber.value = ""
};
   contactForm.addEventListener("submit", addContact);

   const editClicked = (e) => {
    let nodeToEdit = e.target.parentNode.parentNode;//e.target - the edit button, .parentNode - div of the button, .parentNode -the li//
    const idEdit = nodeToEdit.id;
    const updateList = contactListState.find((e) => {
        return e.id === parseInt(idEdit, 10) // e.id equals to ... (remember that === returns true/false (Boolean) result)//
    });

    appState = { //reference to line 12//
        isEdit: true,
        nodeToEdit: nodeToEdit,
        idEdit: idEdit,
        updateList: updateList,
    } 

    addContactBtn.value = "UPDATE CONTACT!";
    name.value = updateList.name;
    phoneNumber.value = updateList.phoneNumber;
    email.value = updateList.email;
   }

   const deleteClicked = (e) => {
    let nodeToDelete = e.target.parentNode.parentNode;
    const idDelete = nodeToDelete.id;
    contactList.removeChild(nodeToDelete);

    const updatedIndex = contactListState.findIndex((contact) => contact.id === parseInt(idDelete, 10));
    contactListState.splice(updatedIndex, 1);

    setLocalStorage(contactListState) //since a contact was deleted, this has to run again to update the local storage//
}

   const newContactElement = (contact) => { //takes references of all the HTML elements and stores each of them in a variable that can be assessed when creating the functionality//
    const listItem = document.createElement('li');
    listItem.id = contact.id;
    const contactDetails = document.createElement('div');
    const contactName = document.createElement('h4');
    const contactEmail = document.createElement('p');
    const contactPhoneNumber = document.createElement('p');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    

    contactName.textContent = contact.name;
    contactEmail.textContent = contact.email;
    contactPhoneNumber.textContent = contact.phoneNumber;
    editBtn.textContent = "Edit";
    deleteBtn.textContent = "Delete";

    contactName.classList.add("contactTitle");
    contactDetails.classList.add('contactDetails');
    editBtn.classList.add('edit');
    deleteBtn.classList.add('delete');

    editBtn.addEventListener("click", editClicked); //sets up the function(editClicked) that will be called whenever the editBtn is clicked//

    deleteBtn.addEventListener("click", deleteClicked); //sets up the function(deleteClicked) that will be called whenever the DeleteBtn is clicked//

    listItem.appendChild(contactName);
    listItem.appendChild(contactDetails);
    contactDetails.appendChild(contactEmail);
    contactDetails.appendChild(contactPhoneNumber);
    contactDetails.appendChild(editBtn);
    contactDetails.appendChild(deleteBtn);

    return listItem

   };

 const renderContact = (contacts) => {
    for (const contact of contacts) {
        const contactItem = newContactElement(contact);
        contactList.appendChild(contactItem);
    }
};

let contactListState_unstring = JSON.parse(localStorage.getItem("contactListState")) || []; //parses the JSON string, constructing the JavaScript value or object described by the string//

contactListState = [...contactListState_unstring];//clarification needed//

renderContact(contactListState_unstring); 
