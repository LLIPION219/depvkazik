const symbols = ['🍋', '7️⃣', '🥝', '🍒', '🍇', '🍊', '🔔', '🍏', '🍌', '🍉', '🍍'];
const spinBtn = document.getElementById('spinBtn');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3')
];
const resultEl = document.getElementById('result');
const betInput = document.getElementById('betInput');
const lostItemsText = document.getElementById('lostItemsText');
const balanceAmount = document.getElementById('balanceAmount');

let spinning = false;
let spinCount = 0;
const totalSpins = 30;
let lostItems = [];
let balance = 0;

betInput.addEventListener('input', function () {
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
        spinCount < totalSpins * 2 / 3 ? 100 : 150;

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

function checkWin([s1, s2, s3]) {
    const bet = betInput.value.trim();
    const betLower = bet.toLowerCase();

    const winMessages = {
        '7️⃣': { multiplier: 1000, jackpot: true },
        '🍋': { multiplier: 10 },
        '🍒': { multiplier: 5 },
        '🍇': { multiplier: 5 },
        '🍊': { multiplier: 3 },
        '🔔': { multiplier: 3 },
        '🍏': { multiplier: 4 },
        '🍌': { multiplier: 6 },
        '🍉': { multiplier: 7 },
        '🍍': { multiplier: 8 }
    };

    if (s1 === s2 && s2 === s3 && winMessages[s1]) {
        const win = winMessages[s1];
        resultEl.textContent = `Ви виграли! Ваша ставка збережена: ${bet} (x${win.multiplier})`;
        if (win.jackpot) resultEl.classList.add('jackpot');
        balance += win.multiplier;
        spinBtn.disabled = false;
    }
    else if ((s1 === '🍋' && s2 === '🍋') || (s2 === '🍋' && s3 === '🍋')) {
        resultEl.textContent = `Ви виграли! Ваша ставка збережена: ${bet} (x2)`;
        balance += 2;
        spinBtn.disabled = false;
    }
    else if ((s1 === '🥝' && s2 === '🥝') || (s2 === '🥝' && s3 === '🥝')) {
        resultEl.textContent = `Ви виграли! Ваша ставка збережена: ${bet} (x5)`;
        balance += 5;
        spinBtn.disabled = false;
    }
    else {
        resultEl.textContent = `Ви депнули: ${bet}`;
        lostItems.push(betLower);
        updateLostItemsText();
        balance -= 1;
        betInput.value = '';
        spinBtn.disabled = true;
    }

    updateBalance();
}

function updateLostItemsText() {
    if (lostItems.length > 0) {
        lostItemsText.textContent = 'Втрачені депи: ' + lostItems.join(', ');
    } else {
        lostItemsText.textContent = '';
    }
}

function updateBalance() {
    balanceAmount.textContent = balance;  // без додавання "USD" тут
}
