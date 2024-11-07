window.addEventListener("load", () => {    
    const menu = new Menu();
    const gameTitle = document.getElementById("game-title");

    menu.addEventListeners();
    changeColor(gameTitle);
})

//Function: Change h1 color
function changeColor(gameTitle) {
    setInterval(() => {
        gameTitle.classList.toggle("navy-blue");
    }, 1000)
    
}