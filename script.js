const symbols = ['🍋', '7️⃣', '🥝', '🍒', '🍇', '🍊', '🔔'];
const spinBtn = document.getElementById('spinBtn');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];
const resultEl = document.getElementById('result');
const betInput = document.getElementById('betInput');
const lostItemsText = document.getElementById('lostItemsText');

let spinning = false;
let spinCount = 0;
const totalSpins = 30;
let lostItems = [];


betInput.addEventListener('input', function() {
    const bet = this.value.trim();
    spinBtn.disabled = bet === '' || lostItems.includes(bet.toLowerCase());
});

spinBtn.addEventListener('click', startSpin);

function startSpin() {
    if (spinning) return;
    
    const bet = betInput.value.trim();
    if (bet === '' || lostItems.includes(bet.toLowerCase())) {
        return;
    }

    spinning = true;
    spinBtn.disabled = true;
    resultEl.textContent = '';
    resultEl.classList.remove('jackpot');
    
    spinCount = 0;
    spinSlots();
}

function spinSlots() {
    if (spinCount >= totalSpins) {
        finishSpin();
        return;
    }

    spinCount++;
    
    slots.forEach(slot => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        slot.textContent = randomSymbol;
    });

    const speed = spinCount < totalSpins / 3 ? 50 : 
                 spinCount < totalSpins * 2/3 ? 100 : 150;
    
    setTimeout(spinSlots, speed);
}

function finishSpin() {
    spinning = false;
    
    const finalSymbols = slots.map(slot => {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        slot.textContent = randomSymbol;
        return randomSymbol;
    });

    checkWin(finalSymbols);
}

function checkWin(symbols) {
    const bet = betInput.value.trim();
    
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        if (symbols[0] === '7️⃣') {
            resultEl.textContent = 'ДЖЕКПОТ! ТИ ЗБЕРІГ ' + bet + ' І ВИГРАВ ВСЕ!';
            resultEl.classList.add('jackpot');
        } else if (symbols[0] === '🍋') {
            resultEl.textContent = 'Ви виграли x10! ' + bet + ' у безпеці + бонус!';
        } else if (symbols[0] === '🍒' || symbols[0] === '🍇') {
            resultEl.textContent = 'Ви виграли x5! ' + bet + ' у безпеці!';
        } else if (symbols[0] === '🍊' || symbols[0] === '🔔') {
            resultEl.textContent = 'Ви виграли x3! ' + bet + ' у безпеці!';
        }
        spinBtn.disabled = false;
    } 
    else if ((symbols[0] === '🍋' && symbols[1] === '🍋') || 
            (symbols[1] === '🍋' && symbols[2] === '🍋')) {
        resultEl.textContent = 'Ви виграли x2! ' + bet + ' у безпеці!';
        spinBtn.disabled = false;
    }
    else if ((symbols[0] === '🥝' && symbols[1] === '🥝') || 
            (symbols[1] === '🥝' && symbols[2] === '🥝')) {
        resultEl.textContent = 'Ви виграли x5! ' + bet + ' у безпеці!';
        spinBtn.disabled = false;
    }
    else {
        resultEl.textContent = 'ТИ ПРОТЕПАВ ' + bet + '! БІЛЬШЕ НЕ МОЖНА ЇЇ ДЕПНУТИ!';
        lostItems.push(bet.toLowerCase());
        updateLostItemsText();
        betInput.value = '';
        spinBtn.disabled = true;
    }
}

function updateLostItemsText() {
    if (lostItems.length > 0) {
        lostItemsText.textContent = 'Втрачені депи: ' + lostItems.join(', ');
    } else {
        lostItemsText.textContent = '';
    }
}