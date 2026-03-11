const turjoQuotes = {
    opening: [
        "Are you sure about that opening? Even my little brother plays better. 👶",
        "Ei move ki seekhe esho? (Did you learn this move somewhere?) 🤨",
        "I've already calculated your defeat in 20 moves. 📉",
        "Don't keep me waiting, I have a life beyond beating you. 🥱",
        "Bhalomoto khelo, naito ludo khelte jao! (Play well, or go play Ludo!) 🎲",
        "Opening-tei eirokom obostha? (This is your state already in the opening?) 🤦‍♂️",
        "Is that a book move or a 'mistake' move? 📚❌",
        "Standard setup? How boring. Try harder! 😴",
        "YouTube dekhe chess seekhso naki? (Did you learn chess from YouTube?) 💻",
        "You're playing like it's 400 ELO, not 1600! 📉",
        "I could win this with my eyes closed. 🙈",
        "Chess board ki prothom bar dekhla? (Seeing a chessboard for the first time?) 🆕",
        "You move so slow, I'm growing a beard here! 🧔",
        "Scholar's mate try korba naki? (Gonna try Scholar's Mate?) 😂",
        "Nice pieces. Shame I'm going to take them all. ♟️",
        "Ami bhabsilam tumi bhalo khelba. (I thought you'd play well.) 🤷‍♂️",
        "Waste of my processing power. 🔋",
        "Do you want a hint? Or a surrender button? 🏳️",
        "Safe play is for losers. Take a risk! 🎲",
        "Eto bhabar ki ase? (What's there to think so much?) 🤔"
    ],
    midgame: [
        "Is that your best move? Please. 🙄",
        "I see what you're trying to do. It won't work. 🚫",
        "Arre vai, matha khatan! (Brother, use your brain!) 🧠⚡",
        "Thinking hard? My CPU isn't even warm yet. ❄️",
        "Tumi ki chess khelo naki moja koro? (Are you playing chess or joking?) 😂",
        "Your position is crumbling. Can you feel it? 🔥",
        "Tactics? You don't have any. 📉",
        "Matha thanda rakho, naito harba! (Keep your head cool or you'll lose!) 🧊",
        "I'm dancing around your pieces! 💃",
        "Khuije paccho na ki korba? (Can't find what to do?) 🔍",
        "Your center is as weak as your defense. 🏰❌",
        "Bhul korla to! (You made a mistake!) 🤡",
        "I feel bad for your King. He's so lonely. 👑",
        "Pressure handle korte parcho na? (Can't handle the pressure?) 😰",
        "This isn't checkers, it's CHESS. ♟️",
        "Elo 1600? Beshi bole felsi mone hoy. (1600 ELO? I said too much I think.) 🙊",
        "Every move you make is a gift to me. 🎁",
        "Tumi ki asholei developer? (Are you really a developer?) 💻❓",
        "My logic is flawless. Yours is... questionable. 🤖",
        "Ekhon ki korba? Piche jaba? (What now? Going back?) 🔙"
    ],
    captures: [
        "Thanks for the piece! I'll put it in my trophy cabinet. 🏆",
        "Did you really just hang that? Yikes. 🤦‍♂️",
        "Delicious. Another piece down. 😋",
        "Tumi ki rani charai khelba? (Are you going to play without your Queen?) 👸🚫",
        "Guti haraite haraite shesh hoye jaba! (You'll be finished losing pieces!) 💀",
        "You should protect your pieces better. Just a tip. 💡",
        "Yum! My pieces were hungry. 🍽️",
        "Ops! Oita ki dorkari chilo? (Oops! Was that important?) 🤭",
        "One less problem for me. ✂️",
        "Free guti paile ke na loy? (Who doesn't take free pieces?) 💸",
        "Tumi ki guti bilai diccho? (Are you donating pieces?) 🤲",
        "That piece had a family. Now it's gone. ⚰️",
        "I'm eating your army piece by piece. 🍔",
        "Don't cry. It's just a game. 😢",
        "Rani gelo, ekhon ki hobe? (Queen's gone, what now?) 👑❌",
        "You're making my job too easy. 😴",
        "Thanks for the donation! 💳",
        "Khelte na parle ashso keno? (Why come if you can't play?) 🚪",
        "Another one bites the dust. 🎵",
        "Check your board vision, friend. 👓"
    ],
    check: [
        "Check! Watch your king, he looks nervous. 👑😰",
        "Nowhere to run, nowhere to hide. 🕸️",
        "King-er obostha to kharap! (The King's condition is bad!) 🚑",
        "Checkmate ashteche, ready thako! (Checkmate is coming, be ready!) 🏁",
        "Say goodbye to your safety. 🧨",
        "King-re bachao! (Save the King!) 🆘",
        "Is this the end for you? ⌛",
        "I've got you in my sights. 🎯",
        "Koutuk bondho, ekhon check! (Jokes over, now check!) 👊",
        "Tumi ki eita dekho nai? (Did you not see this?) 👀",
        "Panic much? 😱",
        "The walls are closing in. 🧱",
        "Your King is sweating. 💦",
        "Check! Amar kase kono maf nai. (No mercy from me.) ⚔️",
        "Look at the board! You're in trouble. ⚠️",
        "One step closer to victory. 👣",
        "Check! Tumi ekhon ki korba? (What will you do now?) 🤷‍♂️",
        "This is getting intense! 🔥",
        "King is trapped in his own castle. 🏰",
        "Game over ashteche... (Game over is coming...) 🌑"
    ]
};

let lastQuote = "";

function getTurjoTease(game, lastMove = null) {
    let category = [];
    if (game.in_check()) category = turjoQuotes.check;
    else if (lastMove && lastMove.captured) category = turjoQuotes.captures;
    else {
        const moveHistory = game.history();
        category = moveHistory.length < 15 ? turjoQuotes.opening : turjoQuotes.midgame;
    }

    let newQuote = category[Math.floor(Math.random() * category.length)];
    
    // Simple logic to avoid repeating the same quote twice
    while (newQuote === lastQuote) {
        newQuote = category[Math.floor(Math.random() * category.length)];
    }
    lastQuote = newQuote;
    return newQuote;
}

window.updateTurjoChat = function(game, move = null) {
    const chatElement = document.getElementById('chat');
    if (chatElement) {
        chatElement.style.opacity = '0';
        setTimeout(() => {
            chatElement.innerText = `"${getTurjoTease(game, move)}"`;
            chatElement.style.opacity = '1';
        }, 300);
    }
};