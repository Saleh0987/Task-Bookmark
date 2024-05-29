let body = document.querySelector('body');
let btnMode = document.querySelector('#btnMode');
let bookmarkName = document.getElementById('bookmarkName');
let bokmarkUrl = document.getElementById('bookmarkURL');
let table = document.getElementById('head');
let searchInput = document.getElementById('searchInput');
let addBtn = document.getElementById('submitBtn');
let updateBtn = document.getElementById('updateBtn');
let bookmarkContainer = [];
let index = 0;

(function () {
    console.log("This function is called immediately");
    let darkmodeFounded = getLocalstorage('Mode');

    //  check dark mode in localStorage
    if (darkmodeFounded) {
        darkMode = darkmodeFounded;
        toggleClass(body, 'dark', darkMode);
        darkMode ? btnMode.innerHTML = `<i class="icon-sun"></i>` : btnMode.innerHTML = `<i class="icon-moon-o"></i>`
    } else {
        darkMode = false;
        setLocalstorage('Mode', darkMode);
    }

    if (localStorage.getItem("bookmarkList") != null) {
    bookmarkContainer = JSON.parse(localStorage.getItem("bookmarkList"));
        displayBookmark();
    } else {
        table.classList.add('d-none');
    }

})();
function toggleClass(el, className, condition) {
    condition ? el.classList.add(className) : el.classList.remove(className);
}

function setLocalstorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function getLocalstorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Alert messages
let messagesAlert = {
    msgErrorObj: {
        icon: "error",
        title: "Oops...",
        text: "The Site Name or URL is not valid.",
        footer: `<p class="text-start fw-semibold">
        <i class="icon-angle-double-right text-danger"></i> The Site Name must contain at least 3 characters. 
        <br>
        <i class="icon-angle-double-right text-danger"></i> The Site URL must be valid.</p>`
    },
    msgSussesObj: {
        title: "Great work!",
        text: "You've successfully added a bookmark.",
        icon: "success",
        timer: 1000
    },
    msgSussesUpdate: {
        title: "Bookmark Updated!",
        icon: "success",
        timer: 1000
    },
    msgSussesDeleted: {
        title: "Bookmark Deleted!",
        icon: "success",
        timer: 1000
    },
    msgConfirmObj: {
        title: "Are you sure?",
        text: "You are about to delete this website. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    },
    msgDeleteObj: {
        title: "Deleted!",
        text: "Your site has been deleted.",
        icon: "success",
        timer: 1000
    }
}



// Add Bookmark
function addBookmark() {
    if (validation(bookmarkName, 'msgName') &&
        validation(bokmarkUrl, 'msgURL') ) 
    {
    let bookmark = {
    bookmarkName: bookmarkName.value,
    bookmarkURL: bokmarkUrl.value
    }
    bookmarkContainer.push(bookmark);
    localStorage.setItem('bookmarkList', JSON.stringify(bookmarkContainer));
    displayBookmark()
    clearInputs() 
    Swal.fire(messagesAlert.msgSussesObj);
        
    } else {
        Swal.fire(messagesAlert.msgErrorObj);
   }
}

// Clear Input
function clearInputs() {
    bookmarkName.value = null;
    bokmarkUrl.value = null;
    bookmarkName.classList.remove('is-valid');
    bokmarkUrl.classList.remove('is-valid');
}

// Display Bookmark
function displayBookmark() {
    let search = searchInput.value;
    let bookmarkData = '';
    for (let i = 0; i < bookmarkContainer.length; i++) {
        if (bookmarkContainer[i].bookmarkName.toLowerCase().includes(search.toLowerCase()) == true) {
            bookmarkData += `<tr>
        <td scope="row" class="fw-semibold">${i + 1}</td>
        <td class="fw-semibold text-capitalize"> ${bookmarkContainer[i].bookmarkName} </td>   
                
        <td>
        <button onclick="visitBookmark('${bookmarkContainer[i].bookmarkURL}')" class="btn btn-success btn-sm text-center">
        <i class="icon-eye1 pe-1 icon-btn"></i>
        </button>
        </td>
        <td>
        <button onClick="setInputsUpdate(${i})" class="btn btn-warning btn-sm">
        <i class="fa-solid fa-square-pen"></i>
        </button>
        </td>
        <td>
        <button onClick="deleteBookmark(${i})" class="btn btn-danger btn-sm">
        <i class="icon-bin pe-1 icon-btn"></i>
        </button>
        </td>
        </tr>`;
        }
    };
    document.getElementById('tableContent').innerHTML = bookmarkData;
    if (bookmarkContainer.length < 1) {
        table.classList.add('d-none');
    } else {
        table.classList.remove('d-none');
    }
}

// Delete Bookmark
function deleteBookmark(index) {
    Swal.fire(messagesAlert.msgConfirmObj)
        .then((result) => {
            if (result.isConfirmed) {
                bookmarkContainer.splice(index, 1);
                localStorage.setItem('bookmarkList', JSON.stringify(bookmarkContainer));
                displayBookmark();
            Swal.fire(messagesAlert.msgSussesDeleted);
            }
        });
}

// Visit bookmark
function visitBookmark(url) {
    window.open(url, '_blank');
}

// Validation 
function validation(element , msgId) {
    let text = element.value;
    let msg = document.getElementById(msgId);
    let regex ={
        bookmarkName:  /^([a-z]{3})[a-z]*$/i,
        bookmarkURL: /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
    }
    if (regex[element.id].test(text) == true) {
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
        msg.classList.add('d-none');
        
        return true;
  } else {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        msg.classList.remove('d-none');
        return false;
  }
}

// Set Update
function setInputsUpdate(indexElement) {
    bookmarkName.value = bookmarkContainer[indexElement].bookmarkName;
    bookmarkURL.value = bookmarkContainer[indexElement].bookmarkURL;
    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
    index = indexElement;
}

// Update
function updateData() {
    let bookmark = {
    bookmarkName: bookmarkName.value,
    bookmarkURL: bokmarkUrl.value
    }

    bookmarkContainer.splice(index, 1, bookmark);
    displayBookmark();
    clearInputs();
    localStorage.setItem('bookmarkList', JSON.stringify(bookmarkContainer));
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    Swal.fire(messagesAlert.msgSussesUpdate);
}

// Dark Mode 
btnMode.addEventListener('click', () => {
    darkMode = !darkMode;
    toggleClass(body, 'dark', darkMode);
    setLocalstorage('Mode', darkMode);
    darkMode ? btnMode.innerHTML = `<i class="icon-sun"></i>` : btnMode.innerHTML = `<i class="icon-moon-o"></i>`
});
