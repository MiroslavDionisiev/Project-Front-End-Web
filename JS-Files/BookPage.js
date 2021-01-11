var bookInfo = document.getElementsByTagName('body')[0].id;
var button = document.querySelector("#ToCart");
var genre = bookInfo.slice(0, bookInfo.length-1);
var booksInCart = [];

db.collection("Books").doc(genre).collection("Titles").doc(bookInfo).get().then(snapshot=>
{
    document.title = snapshot.data().name;
    
    document.getElementById("NameBook").textContent = snapshot.data().name;
    document.getElementById("Author").textContent ="Автор: " + snapshot.data().author;
    document.getElementById("Price").textContent = snapshot.data().priceStr + " лв.";

    let storage = firebase.storage();
    let storageRef = storage.ref();
    let genreRef = storageRef.child(genre);
    imageName = bookInfo+".jpg";
    let imgRef = genreRef.child(imageName);

    imgRef.getDownloadURL().then(function(url) {
        document.getElementById("ImageBook").setAttribute("src", url);
    });

    document.getElementById("Resume").textContent = snapshot.data().resume;
})

function refreshCart()
{
    if(localStorage.getItem("booksInCart")===null)
    {
        localStorage.setItem("booksInCart", JSON.stringify(booksInCart));
    }
    else
    {
        let arrTemp = JSON.parse(JSON.stringify(localStorage.getItem("booksInCart")));
        arrTemp = arrTemp.split(',');
        arrTemp = arrTemp.concat(booksInCart);
        localStorage.setItem("booksInCart", JSON.stringify(arrTemp));
    }
}

button.addEventListener("click", ()=>{
    booksInCart.push(bookInfo);
    refreshCart();
    if(localStorage.getItem("booksInCart")!==null)
    {
        window.location.href = "../../Cart.html";
    }
});