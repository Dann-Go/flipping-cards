class Card {
    constructor(id){
        this.id = id;
        this.text = getRandomSentence(10);
    }

}

function createCard(card){
    const gradient = getRandomGradient();

    const cardNode = document.createElement("div");
    cardNode.classList.add("card");

    const cardFrontNode = document.createElement("div");
    cardFrontNode.classList.add('front');
    cardFrontNode.style.background = gradient;

    const cardBackNode = document.createElement("div");
    cardBackNode.classList.add('back');
    cardBackNode.style.background = gradient;
    cardBackNode.innerText = card.text;
    
    cardNode.appendChild(cardFrontNode);
    cardNode.appendChild(cardBackNode);

    return cardNode;
}

function getRandomColor() {       
    const letters = 'BCDEF'.split('');       
    let color = '#';       
    
    for (var i = 0; i < 6; i++) {         
        color += letters[Math.floor(Math.random() * letters.length)];       
    }        
    return color;     
}

function getRandomGradient(){
    return "linear-gradient(90deg, " + getRandomColor() + ", " + getRandomColor() + ")";
}

function getRandomSentence(length) {       
    const words = ["The sky", "above", "the port", "was", "the color of television", "tuned", "to", "a dead channel", ".", "All", "this happened", "more or less", ".", "I", "had", "the story", "bit by bit", "from various people", "and", "as generally", "happens", "in such cases", "each time", "it", "was", "a different story", ".", "It", "was", "a pleasure", "to", "burn"];        

    let sentence = "";        

    for (let i = 0; i < length; i++) {         
        sentence = `${sentence} ${words[Math.floor(Math.random() * words.length)]}`;      
    }        
    return sentence;    
}


function onLoad(){
    const cardslist = document.getElementById("card-list");
    console.log(cardslist)
    let lastIndex = 0;

    for(let i = 0; i < 3; i++){
        const card = new Card(i);
        cardslist.appendChild(createCard(card));
        lastIndex++;
    }

    const addBtn = document.getElementById("add-btn")
    addBtn.addEventListener("click", ()=>{
        let id = ++lastIndex;
        cardslist.appendChild(createCard(new Card(id)));
    })
}