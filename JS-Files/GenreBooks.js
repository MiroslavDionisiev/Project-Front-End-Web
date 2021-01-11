var authorsAndBooks = new Map();
var formAuthors = document.querySelector("#authors");
var booksList = document.querySelector("#booksList");
var sortBy = document.querySelector("#options");

var genre = document.getElementsByTagName('body')[0].id;

var booksInCart = [];

/*const cartLogo = document.querySelector("#Cart");
cartLogo.addEventListener("click", ()=>{
    refreshCart();
    window.location.href="Cart.html";
});*/

function refreshCart()
{
    if(JSON.parse(localStorage.getItem("booksInCart"))===null)
    {
        localStorage.setItem("booksInCart", booksInCart);
    }
    else
    {
        let arrTemp = JSON.parse(localStorage.getItem("booksInCart"));
        arrTemp = arrTemp.concat(booksInCart);
        localStorage.setItem("booksInCart", JSON.stringify(arrTemp));
    }
}

function populateMap(doc)
{
    if(authorsAndBooks.has(doc.data().author)==false)
    {
        authorsAndBooks.set(doc.data().author,1);
    }
    else
    {
        let numberOfBooks = authorsAndBooks.get(doc.data().author);
        numberOfBooks++;
        authorsAndBooks.set(doc.data().author,numberOfBooks);
    }
}

function renderBook(doc)
{
    let div = document.createElement('div');
    let description = document.createElement('a');
    let img = document.createElement('img');
    let name = document.createElement('span');
    let author = document.createElement('span');
    let price = document.createElement('span');
    let button = document.createElement('a');

    let documentName = doc.data().imageStr;

    button.setAttribute("href", "./Cart.html");
    button.setAttribute("id", "buttonToCart");
    button.addEventListener("click", ()=>{
        booksInCart.push(documentName);
        refreshCart();
    });

    var storage = firebase.storage();
    var storageRef = storage.ref();
    var genreRef = storageRef.child(genre);
    imageName = doc.data().imageStr+".jpg";
    var imgRef = genreRef.child(imageName);

    imgRef.getDownloadURL().then(function(url) {
        img.setAttribute("src", url);
    });

    div.setAttribute("class", "bookToSelect");
    name.textContent = doc.data().name;
    author.textContent = doc.data().author;
    price.textContent = doc.data().priceStr;
    button.textContent = "Добави в количка";

    let directory = "./Books/"+genre+"/"+transliterate(doc.data().name)+".html";
    description.setAttribute("class", "selectBook");
    description.setAttribute("href", directory);
    description.appendChild(img);
    description.appendChild(name);
    description.appendChild(author);
    description.appendChild(price);

    div.appendChild(description);
    div.appendChild(button);

    booksList.appendChild(div);
}

function transliterate(text) {

    text = text
        .replace(/а/gi, 'a')
        .replace(/б/gi, 'b')
        .replace(/в/gi, 'v')
        .replace(/г/gi, 'g')
        .replace(/д/gi, 'd')
        .replace(/е/gi, 'e')
        .replace(/ж/gi, 'zh')
        .replace(/з/gi, 'z')
        .replace(/и/gi, 'i')
        .replace(/й/gi, 'y')
        .replace(/ѝ/gi, 'i')
        .replace(/к/gi, 'k')
        .replace(/л/gi, 'l')
        .replace(/м/gi, 'm')
        .replace(/н/gi, 'n')
        .replace(/о/gi, 'o')
        .replace(/п/gi, 'p')
        .replace(/р/gi, 'r')
        .replace(/с/gi, 's')
        .replace(/т/gi, 't')
        .replace(/у/gi, 'u')
        .replace(/ф/gi, 'f')
        .replace(/х/gi, 'h')
        .replace(/ц/gi, 'ts')
        .replace(/ч/gi, 'ch')
        .replace(/ш/gi, 'sh')
        .replace(/щ/gi, 'sht')
        .replace(/ъ/gi, 'a')
        .replace(/ь/gi, 'y')
        .replace(/ю/gi, 'yu')
        .replace(/я/gi, 'ya')

        .replace(/\u0020/gi,'-')
        .replace(',','')
        .replace('.','')
        

    return text;
};

function listAuthors()
{
    for (const [key, value] of authorsAndBooks.entries()) {
        addAuthor(key, value, false);
    }
}   

function addAuthor(name, value, isChecked)
{
    let checkbox = document.createElement('input');
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "authors");
        checkbox.setAttribute("value", name);
        if(isChecked==true)
        {
            checkbox.setAttribute("checked", true);
        }

        checkbox.addEventListener('change', function()
        {
            clearBooks()
            if(checkbox.checked == true)
            {
                db.collection('Books').doc(genre).collection('Titles').where('author','==',name).get().then(snapshot=>
                {
                    clearAuthors();
                    addAuthor(name, value, true);
                    printBooks(snapshot);
                })
            }
            else
            {
                db.collection('Books').doc(genre).collection('Titles').get().then(snapshot=>
                {
                    clearAuthors();
                    listAuthors();
                    printBooks(snapshot);
                })
            }
        });
        
        let labelText = name;
        labelText+=" ";
        labelText+="(" + value + ")";
        let label = document.createElement('label');
        label.textContent = labelText;

        formAuthors.appendChild(checkbox);
        formAuthors.appendChild(label);
        formAuthors.appendChild(document.createElement('br'));
}

function clearBooks()
{
    while (booksList.lastElementChild) 
    {
        booksList.removeChild(booksList.lastElementChild);
    }
}

function clearAuthors()
{
    while (formAuthors.lastElementChild && formAuthors.lastElementChild!=formAuthors.firstElementChild) 
    {
        formAuthors.removeChild(formAuthors.lastElementChild);
    }
    formAuthors.appendChild(document.createElement('br'));
}

function printBooks(snapshot)
{
    snapshot.docs.forEach(doc => {
        renderBook(doc);
    });
}

db.collection('Books').doc(genre).collection('Titles').get().then(snapshot=>
{
    snapshot.docs.forEach(doc => {
        populateMap(doc);
    });
    printBooks(snapshot);
    listAuthors();
})