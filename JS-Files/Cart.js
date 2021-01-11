var booksInCart = JSON.parse(localStorage.getItem("booksInCart"));
var mainSection = document.getElementsByTagName('main')[0];
var endSum = document.querySelector("#endSum")
var clearCartBtn = document.querySelector("#clearCart")
var totalPrice = 0;
var books = new Map();

clearCartBtn.addEventListener("click", ()=>{
    books = new Map();
    localStorage.setItem("booksInCart", JSON.stringify([]));
    window.location.href="./Cart.html";
});

function refreshCart()
{
    let newCart = [];
    for(const [key, value] of books.entries())
    {
        let valueCopy = value; 
        while(valueCopy--)
        {
            newCart.push(key);
        }
    }
    localStorage.setItem("booksInCart", JSON.stringify(newCart));
}

function incrementBooksCount(book)
{
    let count = books.get(book.data().imageStr);
    count++;
    books.set(book.data().imageStr, count);
    totalPrice+=book.data().price;
    refreshCart();
}

function decrementBooksCount(book)
{
    let count = books.get(book.data().imageStr);
    if(count>1)
    {
        count--;
        totalPrice-=book.data().price;
        books.set(book.data().imageStr, count);
    }
    else
    {
        totalPrice-=book.data().price;
        books.delete(book.data().imageStr);
    }
    refreshCart();
}

function orderInMap()
{
    booksInCart.forEach(book => {
        if(books.has(book)===true)
        {
            let number = books.get(book);
            number++;
            books.set(book, number);
        }
        else
        {
            books.set(book, 1);
        }
    });
}

function getGenre(bookIdentifier)
{
    while(bookIdentifier[bookIdentifier.length-1]>='0'&&bookIdentifier[bookIdentifier.length-1]<='9')
    {
        bookIdentifier=bookIdentifier.substring(0, bookIdentifier.length-1);
    }
    return bookIdentifier;
}

function renderBook(book, genre, numberOfBooks)
{
    totalPrice += book.data().price * numberOfBooks;

    let mainDiv = document.createElement('div');
    let descriptionDiv = document.createElement('div');
    let infoDiv = document.createElement('div');
    let countItemsDiv = document.createElement('div');
    let changeCountDiv = document.createElement('div');

    mainDiv.setAttribute("class", "bookListed");
    descriptionDiv.setAttribute("class", "bookDescription");
    infoDiv.setAttribute("class", "bookInfo");
    countItemsDiv.setAttribute("class", "countItemsSection");
    changeCountDiv.setAttribute("class", "incrementDecrement");

    let img = document.createElement('img');
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var genreRef = storageRef.child(genre);
    imageName = book.data().imageStr+".jpg";
    var imgRef = genreRef.child(imageName);

    imgRef.getDownloadURL().then(function(url) {
        img.setAttribute("src", url);
        img.setAttribute("alt", "bookCover");
    });

    let spanName = document.createElement('span');
    let spanAuthor = document.createElement('span');
    let spanPrice = document.createElement('span');
    spanAuthor.textContent = book.data().author;
    spanName.textContent = book.data().name;
    spanPrice.textContent = book.data().priceStr;

    let input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("id", "countItems");
    input.setAttribute("name", "countItems");
    input.value = numberOfBooks;

    let increment = document.createElement('button');
    let decrement = document.createElement('button');
    increment.textContent = "+";
    decrement.textContent = "-";

    increment.addEventListener("click", ()=>{
        input.value++;
        incrementBooksCount(book);
        printTotalPrice();
    });

    decrement.addEventListener("click", ()=>{
        if(input.value>=1)
        {
            input.value--;
            decrementBooksCount(book);
        }
        printTotalPrice();
    });

    let remove = document.createElement('button');
    remove.textContent = "Премахни книга";
    remove.setAttribute("class", "remove");

    remove.addEventListener("click", ()=>{
        books.set(book.data().imageStr, 0);
        totalPrice-=book.data().price.toFixed(2)*numberOfBooks;
        refreshCart();
        window.location.href="./Cart.html"
    });

    infoDiv.appendChild(spanName);
    infoDiv.appendChild(spanAuthor);
    infoDiv.appendChild(spanPrice);

    descriptionDiv.appendChild(img);
    descriptionDiv.appendChild(infoDiv);

    changeCountDiv.appendChild(increment);  
    changeCountDiv.appendChild(decrement);

    countItemsDiv.appendChild(input);
    countItemsDiv.appendChild(changeCountDiv);
    countItemsDiv.appendChild(remove);

    mainDiv.appendChild(descriptionDiv);
    mainDiv.appendChild(countItemsDiv);

    mainSection.appendChild(mainDiv);

    printTotalPrice();
}

function printTotalPrice()
{
    endSum.innerHTML = "Обща сума: "+totalPrice.toFixed(2);
}

orderInMap();
for (const [key, value] of books.entries()) {
    let genre = getGenre(key);
    let bookRef = db.collection('Books').doc(genre).collection('Titles').doc(key);
    bookRef.get().then(doc=>{
        renderBook(doc, genre, value);
    });
}