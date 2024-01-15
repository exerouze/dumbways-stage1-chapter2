class Card {
    #image = "";
    #content = "";
    #author = "";

    constructor(image, content, author) {
        this.#image = image;
        this.#content = content;
        this.#author = author;
    }

    set image(val) {
        this.#image = val;
    }
    set content(val) {
        this.#content = val;
    }
    set author(val) {
        this.#author = val;
    }

    get image() {
        return this.#image;
    }
    get content() {
        return this.#content;
    }
    get author() {
        return this.#author;
    }

    html() {
        throw new Error("Choose company or person");
    }
}

class Person extends Card {
    html() {
        return `
            <div class="oopCard">
                <img src="${this.image}" class="oopImg" alt="">
                <p class="oopDesc">${this.content}</p>
                <p class="oopAuthor">${this.author}</p>
            </div>
        `;
    }
}

class Company extends Card {
    html() {
        return `
            <div class="oopCard">
                <img src="${this.image}" class="oopImg" alt="">
                <p class="oopDesc">${this.content}</p>
                <p class="oopAuthor">${this.author} Company</p>
            </div>
        `;
    }
}

const card1 = new Person("https://www.greenscene.co.id/wp-content/uploads/2022/07/Gojo.jpg", "I’m gonna reset this crappy Jujutsu world. It’d be easy to kill everyone who’s in charge. But someone else would just take their place. Nothing would change. And it’s not as if people approve of massacres anyway… So that’s why I’m turning to education. I need strong and intelligent allies. I need to foster them.", "Gojo Satoru");
const card2 = new Company("https://asset.kompas.com/crops/Nzd8Wg_VyGH8dM9CI4J1fqIupco=/0x0:3159x2106/750x500/data/photo/2021/05/02/608eb6854cbba.jpg", "We’ve had three big ideas at Amazon that we’ve stuck with for 18 years, and they’re the reason we’re successful: Put the customer first. Invent. And be patient.", "Jeff Bezos");
const card3 = new Person("https://e1.pxfuel.com/desktop-wallpaper/87/798/desktop-wallpaper-joji-tumblr-posts-joji-aesthetic.jpg", "When you cry, you waste your time. Over boys you never liked. Can you not be so obvious? So keep it light", "Joji");

const cards = [card1, card2,card3];
let cardHtml = "";

for (let i = 0; i < cards.length; i++) {
    cardHtml += cards[i].html();
}

document.getElementById("card").innerHTML = cardHtml;
