
var bookInfoFromPage = JSON.parse(localStorage.getItem("bookInformation")); 


function renderBook(){
    
    document.title = bookInfoFromPage.data.name;
    
    document.getElementById("NameBook").innerHTML = bookInfoFromPage.data.name;
    document.getElementById("Author").innerHTML = bookInfoFromPage.data.author;
    document.getElementById("Price").innerHTML = bookInfoFromPage.data.priceStr + " лв.";
    document.getElementById("ImageBook").src = bookInfoFromPage.img;

    document.getElementById("Resume").innerHTML = bookInfoFromPage.data.resume;
}

renderBook();