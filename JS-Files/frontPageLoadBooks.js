const genresList = document.querySelector("#genres-list");
//const cartLogo = document.querySelector("#Cart");
var booksInCart = [];

function refreshCart()
{
    if(JSON.parse(localStorage.getItem("booksInCart"))===null)
    {
        localStorage.setItem("booksInCart", JSON.stringify(booksInCart));
    }
    else
    {
        let arrTemp = JSON.parse(localStorage.getItem("booksInCart"));
        arrTemp = arrTemp.concat(booksInCart);
        localStorage.setItem("booksInCart", JSON.stringify(arrTemp));
    }
}

function renderLeftSide(genre, genreSelector, index)
{
    let ulLeft = document.createElement('ul');
    let li1 = document.createElement('li');
    let span = document.createElement('span');
    let li2 = document.createElement('li');
    let button = document.createElement('a');

    if(index%2==0)
    {
        ulLeft.setAttribute("class", "colourForLeftFirstType leftSideOfRow noDefaultListStyle");
        button.setAttribute("class", "buttonStyleFirst");
    }
    else
    {
        ulLeft.setAttribute("class", "colourForLeftSecondType leftSideOfRow noDefaultListStyle");
        button.setAttribute("class", "buttonStyleSecond");
    }

    span.textContent=genre;
    button.textContent="Повече книги"
    let HrefNext = genreSelector+".html";
    button.setAttribute("href", HrefNext);

    button.addEventListener("click", ()=>{
        refreshCart();
    })

    li1.appendChild(span);
    li2.appendChild(button);
    ulLeft.appendChild(li1);
    ulLeft.appendChild(li2);

    genresList.appendChild(ulLeft);
    return ulLeft;
} 

function renderRightSide(doc, genre, index)
{
    let ulRight = document.createElement('ul');
    genre.collection('Titles').get().then((snapshot)=>{
        let indexCurrent = 1;
        if(index%2==0)
        {
            ulRight.setAttribute("class", "colourForRightFirstType rightSideOfRow noDefaultListStyle");
        }
        else
        {
            ulRight.setAttribute("class", "colourForRighttSecondType rightSideOfRow noDefaultListStyle");
        }
        let indexCount = 1;
        snapshot.forEach(book => {
            if(indexCount<=8)
            {
                let currentBook = doc.data().genreSelector + indexCurrent;
                console.log(currentBook);
                ulRight.appendChild(renderRightSideUtility(book, doc.data().genreSelector, currentBook));
                indexCurrent++;
            }
            indexCount++;
        });
    })

    return ulRight;
}

function renderRightSideUtility(doc, genre, imageName)
{
    let documentName = imageName;

    let li = document.createElement('li');
    let div = document.createElement('div');
    let img = document.createElement('img');
    let name = document.createElement('span');
    let author = document.createElement('span');
    let price = document.createElement('span');
    let button = document.createElement('a');

    var storage = firebase.storage();
    var storageRef = storage.ref();
    var genreRef = storageRef.child(genre);
    imageName+=".jpg"
    var imgRef = genreRef.child(imageName);
    
    imgRef.getDownloadURL().then(function(url) {
      img.setAttribute("src", url);
    });

    name.textContent=doc.data().name;
    author.textContent=doc.data().author;
    price.textContent=doc.data().priceStr;
    button.textContent="Добави в количка";
    button.setAttribute("href", "./Cart.html")

    button.addEventListener("click", ()=>{
        booksInCart.push(documentName);
        refreshCart();
    });

    div.setAttribute("class", "bookDescription");

    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(author);
    div.appendChild(price);
    div.appendChild(button);
    li.appendChild(div);

    return li;
}

function render(doc, index)
{
    let liMain = document.createElement('li');
    let divMainRow = document.createElement('div');

    divMainRow.setAttribute("class", "rowOfMainList");
    divMainRow.appendChild(renderLeftSide(doc.data().name, doc.data().genreSelector, index));
    divMainRow.appendChild(renderRightSide(doc, doc.ref, index));
    liMain.appendChild(divMainRow);
    genresList.appendChild(liMain);
}

db.collection('Books').get().then((snapshot)=>{
    let index = 0;
    snapshot.docs.forEach(doc => {
        render(doc,index);
        index++;
    });
})
