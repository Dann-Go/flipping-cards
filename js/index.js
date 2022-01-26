class Card {
    constructor(id) {
        this.id = id;
        this.text = getRandomSentence(10);
    }

}

const cards = [];
const cardNodes = new Map();

function createCardNode(card) {

    const gradient = getRandomGradient();

    const cardNode = document.createElement("div");
    cardNode.classList.add("card");
    cardNode.setAttribute("data-id", card.id);

    const cardWrapperNode = document.createElement("div");
    cardWrapperNode.classList.add("card__wrapper");

    const cardFrontNode = document.createElement("div");
    cardFrontNode.classList.add('front');
    cardFrontNode.style.background = gradient;

    const cardBackNode = document.createElement("div");
    cardBackNode.classList.add('back');
    cardBackNode.style.background = gradient;
    cardBackNode.innerText = card.text;

    cardWrapperNode.appendChild(cardFrontNode);
    cardWrapperNode.appendChild(cardBackNode);

    cardNode.appendChild(cardWrapperNode);
    cardWrapperNode.addEventListener("click", () => {
        cardWrapperNode.classList.toggle("active")
    })

    return cardNode;
}

function getRandomColor() {
    const letters = 'BCDEF'.split('');
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function getRandomGradient() {
    return `linear-gradient(90deg, ${getRandomColor()}, ${getRandomColor()})`;
}

function getRandomSentence(length) {
    const words = ["The sky", "above", "the port", "was", "the color of television", "tuned", "to", "a dead channel", ".", "All", "this happened", "more or less", ".", "I", "had", "the story", "bit by bit", "from various people", "and", "as generally", "happens", "in such cases", "each time", "it", "was", "a different story", ".", "It", "was", "a pleasure", "to", "burn"];

    let sentence = "";

    for (let i = 0; i < length; i++) {
        sentence = `${sentence} ${words[Math.floor(Math.random() * words.length)]}`;
    }
    return sentence;
}

function renderCard(cardList, cardNode, isStart = true) {
    if (!isStart) {
        cardList.appendChild(cardNode);
    } else {
        cardList.prepend(cardNode);
    }
}

function rerender(cardList, cards, cardNodes) {
    cards.forEach(card => cardList.appendChild(cardNodes.get(card.id)));
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


function onLoad() {
    const cardslist = document.getElementById("card-list");
    console.log(cardslist)
    let lastIndex = 0;

    for (let i = 0; i < 3; i++) {
        let card = new Card(i);
        let cardNode = createCardNode(card);
        cards.push(card);
        cardNodes.set(card.id, cardNode);
        renderCard(cardslist, cardNode)
        lastIndex++;
    }

    const addEndBtn = document.getElementById("add-end-btn");
    addEndBtn.addEventListener("click", () => {
        if (cards.length > 19) {
            alert("Sorry the limit is 20 cards");
            return;
        }
        let id = lastIndex++;
        let card = new Card(id);
        let cardNode = createCardNode(card);
        cards.push(card);
        cardNodes.set(card.id, cardNode);
        animate([...cardNodes.values()], () => renderCard(cardslist, cardNode, false));
    })

    const addStartBtn = document.getElementById("add-start-btn");
    addStartBtn.addEventListener("click", () => {
        if (cards.length > 19) {
            alert("Sorry the limit is 20 cards");
            return;
        }
        let id = ++lastIndex;
        let card = new Card(id);
        let cardNode = createCardNode(card);
        cards.unshift(card);
        cardNodes.set(card.id, cardNode);
        animate([...cardNodes.values()], () => renderCard(cardslist, cardNode, true));
    })

    const shuffleBtn = document.getElementById("shuffle-btn");
    shuffleBtn.addEventListener("click", () => {
        shuffle(cards)
        animate([...cardNodes.values()], () => rerender(cardslist, cards, cardNodes))
    })

    console.log(cardNodes);
    console.log(cardNodes.values());
}

const DISPL_THRESHOLD = 3;

function createSpringAnimation(dx, dy, dw = 0, dh = 0, stiffness = 600, damping = 50, mass = 1) {
    if (dx === 0 && dy === 0) return {positions: [], frames: 0};

    const spring_length = 0;
    const k = -stiffness;
    const d = -damping;
    const frame_rate = 1 / 60;

    let x = dx;
    let y = dy;

    let velocity_x = 0;
    let velocity_y = 0;

    let positions = [];

    let frames = 0;
    let frames_below_threshold = 0;
    let largest_displ;

    for (let step = 0; step <= 1000; step += 1) {
        let Fspring_x = k * (x - spring_length);
        let Fspring_y = k * (y - spring_length);
        let Fdamping_x = d * velocity_x;
        let Fdamping_y = d * velocity_y;

        let accel_x = (Fspring_x + Fdamping_x) / mass;
        let accel_y = (Fspring_y + Fdamping_y) / mass;

        velocity_x += accel_x * frame_rate;
        velocity_y += accel_y * frame_rate;

        x += velocity_x * frame_rate;
        y += velocity_y * frame_rate;

        positions.push({
            transform: `translate(${x}px, ${y}px)`,
        });

        // Save the last largest displacement so that we can compare it with threshold later
        largest_displ =
            largest_displ < 0
                ? Math.max(largest_displ || -Infinity, Math.sqrt(x ** 2 + y ** 2))
                : Math.min(largest_displ || Infinity, Math.sqrt(x ** 2 + y ** 2));

        if (Math.abs(largest_displ) < DISPL_THRESHOLD) {
            frames_below_threshold += 1;
        } else {
            frames_below_threshold = 0; // Reset the frame counter
        }

        if (frames_below_threshold >= 60) {
            console.debug(
                "Largest displacement over last 60 frames",
                `${Math.abs(largest_displ)}px`
            );
            frames = step;
            break;
        }
    }

    if (frames == 0) {
        frames = 1000;
    }

    console.debug(`Generated ${frames} frames`);

    return {positions, frames};
}

function animate(elements, callback) {
    const initialDimensionsList = elements.map((element) =>
        element.getBoundingClientRect()
    );

    callback();

    const lastDimensionsList = elements.map((element) =>
        element.getBoundingClientRect()
    );

    const deltaXList = initialDimensionsList.map(
        (initialDimensions, index) =>
            initialDimensions.left - lastDimensionsList[index].left
    );
    const deltaYList = initialDimensionsList.map(
        (initialDimensions, index) =>
            initialDimensions.top - lastDimensionsList[index].top
    );
    const deltaWList = initialDimensionsList.map(
        (initialDimensions, index) =>
            initialDimensions.width / lastDimensionsList[index].width
    );
    const deltaHList = initialDimensionsList.map(
        (initialDimensions, index) =>
            initialDimensions.height / lastDimensionsList[index].height
    );

    elements.forEach((element, index) =>
            //   element.animate(
            //     [
            //       {
            //         transformOrigin: "top left",
            //         transform: `
            //   translate(${deltaXList[index]}px, ${deltaYList[index]}px)
            //   scale(${deltaWList[index]}, ${deltaHList[index]})
            // `,
            //       },
            //       {
            //         transformOrigin: "top left",
            //         transform: "none",
            //       },
            //     ],
            //     {
            //       duration: 300,
            //       easing: "ease-in-out",
            //       fill: "both",
            //     }
            //   )
        {
            const {positions, frames} = createSpringAnimation(
                deltaXList[index],
                deltaYList[index]
            );

            const keyframes = new KeyframeEffect(element, positions, {
                duration: (frames / 60) * 1000,
                fill: "both",
                easing: "linear",
                iterations: 1,
            });

            const animation = new Animation(keyframes);

            animation.play();
        }
    );
}