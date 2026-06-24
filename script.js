// ============================================================
// CONFIGURAÇÃO DO JOGO
// ============================================================
const texto =
    "Eu não sou o melhor desenvolvedor...\n" +
    "Mas preparei esse presente com carinho pra você 💖\n" +
    "Antes do seu presente… tenta me pegar 😌";

let index = 0;
let tentativas = 0;
const maxTentativas = 10;
let jogoAtivo = false;
let cooldown = false;

const mensagens = [
    "Me pega 😏",
    "Quaseee 😜",
    "Ops, fui pra lá 💨",
    "Assim não vale 😳",
    "Tá difícil né? 😅",
    "Chega mais 😌",
    "Muito perto 👀",
    "Hehe, errou 💖",
    "Agora vai 😳",
    "Última chance 😮"
];

// ============================================================
// CONFIGURAÇÃO DA SURPRESA — ALTERE AQUI QUANDO ESTIVER PRONTO
// ============================================================

// ALTERE: substitua pelo texto da carta que você escreveu pra ela
const cartaTextoStr =
    "Minha Be,\n\n" +
    "Fiz esse joguinho bobo porque queria te ver sorrindo.\n\n" +
    "Você não espera por grandes gestos.\n" +
    "Mas merece cada um deles.\n\n" +
    "Obrigado por todos os dias ao seu lado,\n" +
    "por cada risada, cada olhar,\n" +
    "cada momento guardado.\n\n" +
    "Hoje é nosso dia, e eu faria tudo de novo\n" +
    "mil vezes, contigo.\n\n" +
    "Com todo o meu amor,\n" +
    "[seu nome] 💖";

const dataInicio = new Date("2022-10-08");

// ============================================================
// ELEMENTOS
// ============================================================
const typingText   = document.getElementById("typingText");
const startBtn     = document.getElementById("start");
const startScreen  = document.getElementById("startScreen");
const fujao        = document.getElementById("fujao");
const winnerScreen = document.getElementById("winnerScreen");
const winSound     = document.getElementById("winSound");
const contador     = document.getElementById("contador");

const musicaFundo     = document.getElementById("musicaFundo");
const surpresaScreen  = document.getElementById("surpresaScreen");
const faseEnvelope    = document.getElementById("faseEnvelope");
const faseCarta       = document.getElementById("faseCarta");
const faseFotos       = document.getElementById("faseFotos");
const faseContador    = document.getElementById("faseContador");
const envelopeEl      = document.getElementById("envelope");
const cartaEl         = document.getElementById("cartaTexto");
const cartaDiv        = document.querySelector(".carta");
const verFotosBtn     = document.getElementById("verFotosBtn");
const verContadorBtn  = document.getElementById("verContadorBtn");
const diasNumEl       = document.getElementById("diasNum");

const slides      = document.querySelectorAll(".slide");
const totalSlides = slides.length;
let slideAtual    = 0;
let slidesVistos  = new Set();

let cartaIndex = 0;
let cartaTimer = null;

// ============================================================
// CORAÇÕES DE FUNDO
// ============================================================
function gerarCorações() {
    const container = document.querySelector(".hearts");
    container.innerHTML = "";
    const emojis = ["💖", "💕", "💗", "💓", "🌸", "✨", "🫶"];
    for (let i = 0; i < 20; i++) {
        const h = document.createElement("span");
        h.classList.add("heart");
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        h.style.left = Math.random() * 100 + "%";
        h.style.fontSize = (12 + Math.random() * 16) + "px";
        h.style.animationDuration = (7 + Math.random() * 9) + "s";
        h.style.animationDelay = (-Math.random() * 8) + "s";
        container.appendChild(h);
    }
}
gerarCorações();

// ============================================================
// TELA INICIAL — EFEITO DIGITAÇÃO
// ============================================================
function typeEffect() {
    if (index < texto.length) {
        typingText.innerHTML += texto.charAt(index);
        index++;
        setTimeout(typeEffect, 35);
    }
    if (index === texto.length) {
        startBtn.style.opacity = "1";
        startBtn.style.transform = "scale(1)";
    }
}
typeEffect();

startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    fujao.style.display = "block";
    fujao.innerText = mensagens[0];
    jogoAtivo = true;
    atualizarContador();
    moverBotao();
});

// ============================================================
// CONTADOR DE TENTATIVAS (corações no topo)
// ============================================================
function atualizarContador() {
    contador.innerHTML = "";
    for (let i = 0; i < maxTentativas; i++) {
        const span = document.createElement("span");
        span.textContent = i < tentativas ? "🖤" : "❤️";
        contador.appendChild(span);
    }
    contador.style.display = jogoAtivo ? "flex" : "none";
}

// ============================================================
// MOVIMENTO DO BOTÃO FUGITIVO
// ============================================================
function moverBotao(mouseX, mouseY) {
    const margem = 20;
    const bw = fujao.offsetWidth  || 130;
    const bh = fujao.offsetHeight || 50;
    const maxX = window.innerWidth  - bw - margem;
    const maxY = window.innerHeight - bh - margem;

    let x, y;

    if (mouseX !== undefined && mouseY !== undefined) {
        const rect = fujao.getBoundingClientRect();
        const bx = rect.left + rect.width  / 2;
        const by = rect.top  + rect.height / 2;
        const dx = bx - mouseX;
        const dy = by - mouseY;
        const dist = Math.hypot(dx, dy) || 1;
        const fuga = 180 + tentativas * 25;

        x = bx + (dx / dist) * fuga + (Math.random() - 0.5) * 120;
        y = by + (dy / dist) * fuga + (Math.random() - 0.5) * 120;
    } else {
        x = margem + Math.random() * (maxX - margem);
        y = margem + Math.random() * (maxY - margem);
    }

    x = Math.max(margem, Math.min(maxX, x));
    y = Math.max(margem + 55, Math.min(maxY, y));

    const velocidade = Math.max(0.08, 0.45 - tentativas * 0.037);
    fujao.style.transition = `left ${velocidade}s ease, top ${velocidade}s ease`;
    fujao.style.left = x + "px";
    fujao.style.top  = y + "px";

    const g = Math.max(10,  79 - tentativas * 4);
    const b = Math.max(30, 154 - tentativas * 12);
    fujao.style.background = `rgb(255, ${g}, ${b})`;
}

// ============================================================
// RASTRO DE CORAÇÕES
// ============================================================
function criarRastro() {
    const rect  = fujao.getBoundingClientRect();
    const emojis = ["💕", "💗", "✨", "💖"];
    const trail = document.createElement("span");
    trail.classList.add("trail-heart");
    trail.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    trail.style.left = (rect.left + rect.width  / 2) + "px";
    trail.style.top  = (rect.top  + rect.height / 2) + "px";
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 950);
}

// ============================================================
// FUGA POR DISTÂNCIA (mouse + touch)
// ============================================================
const raioBase = 130;

function verificarFuga(cx, cy) {
    if (!jogoAtivo || tentativas >= maxTentativas || cooldown) return;

    const rect = fujao.getBoundingClientRect();
    const bx = rect.left + rect.width  / 2;
    const by = rect.top  + rect.height / 2;
    const dist = Math.hypot(cx - bx, cy - by);
    const raio = raioBase + tentativas * 8;

    if (dist < raio) {
        cooldown = true;
        tentativas++;
        criarRastro();
        fujao.innerText = mensagens[Math.min(tentativas, mensagens.length - 1)];
        atualizarContador();
        moverBotao(cx, cy);

        if (tentativas >= maxTentativas) {
            setTimeout(() => {
                fujao.classList.add("shake");
                fujao.innerText = "Agora pode clicar 😳💖";
                fujao.style.transition = "none";
                jogoAtivo = false;
            }, 350);
        }

        setTimeout(() => { cooldown = false; }, 450);
    }
}

document.addEventListener("mousemove", (e) => verificarFuga(e.clientX, e.clientY));
document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    verificarFuga(t.clientX, t.clientY);
}, { passive: true });

// ============================================================
// VITÓRIA
// ============================================================
function mostrarVitoria() {
    fujao.style.display = "none";
    winnerScreen.classList.add("ativo");
    contador.style.display = "none";
    try { winSound.play(); } catch (_) {}
    lançarConfete();
}

fujao.addEventListener("click",    () => { if (tentativas >= maxTentativas) mostrarVitoria(); });
fujao.addEventListener("touchend", (e) => { e.preventDefault(); if (tentativas >= maxTentativas) mostrarVitoria(); });

// ============================================================
// CONFETE
// ============================================================
function lançarConfete() {
    const emojis = ["💖", "💕", "✨", "🌸", "💗", "💓", "🎉", "🫶"];
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const c = document.createElement("span");
            c.classList.add("confete");
            c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            c.style.left = Math.random() * 100 + "vw";
            c.style.fontSize = (14 + Math.random() * 16) + "px";
            c.style.animationDuration = (1.5 + Math.random() * 2) + "s";
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 3800);
        }, i * 50);
    }
}

// ============================================================
// SURPRESA — FASE 1: ENVELOPE
// ============================================================
document.getElementById("surpresaBtn").addEventListener("click", () => {
    winnerScreen.classList.remove("ativo");
    surpresaScreen.classList.add("ativo");
    tocarMusica();
});

envelopeEl.addEventListener("click", () => {
    envelopeEl.classList.add("abrindo");
    setTimeout(() => {
        faseEnvelope.classList.add("escondida");
        faseCarta.classList.remove("escondida");
        typeCarta();
    }, 650);
});

// ============================================================
// SURPRESA — FASE 2: CARTA (typewriter)
// ============================================================
function typeCarta() {
    if (cartaIndex < cartaTextoStr.length) {
        const char = cartaTextoStr.charAt(cartaIndex);
        cartaEl.innerHTML += (char === "\n") ? "<br>" : char;
        cartaIndex++;
        cartaDiv.scrollTop = cartaDiv.scrollHeight;
        cartaTimer = setTimeout(typeCarta, 28);
    } else {
        revelarBotao(verFotosBtn);
    }
}

verFotosBtn.addEventListener("click", () => {
    faseCarta.classList.add("escondida");
    faseFotos.classList.remove("escondida");
    gerarDots();
    mostrarSlide(0);
});

// ============================================================
// SURPRESA — FASE 3: SLIDESHOW DE FOTOS
// ============================================================
function gerarDots() {
    const dotsEl = document.getElementById("slideDots");
    dotsEl.innerHTML = "";
    slides.forEach((_, i) => {
        const d = document.createElement("span");
        d.classList.add("dot");
        d.addEventListener("click", () => mostrarSlide(i));
        dotsEl.appendChild(d);
    });
}

function mostrarSlide(n) {
    slides.forEach((s, i) => s.classList.toggle("ativo", i === n));
    slideAtual = n;
    atualizarDots();
    slidesVistos.add(n);
    if (slidesVistos.size === totalSlides) {
        revelarBotao(verContadorBtn);
    }
}

function atualizarDots() {
    document.querySelectorAll(".dot").forEach((d, i) => {
        d.classList.toggle("ativo", i === slideAtual);
    });
}

document.getElementById("prevFoto").addEventListener("click", () => {
    mostrarSlide((slideAtual - 1 + totalSlides) % totalSlides);
});

document.getElementById("nextFoto").addEventListener("click", () => {
    mostrarSlide((slideAtual + 1) % totalSlides);
});

verContadorBtn.addEventListener("click", () => {
    faseFotos.classList.add("escondida");
    faseContador.classList.remove("escondida");
    animarContador();
});

// ============================================================
// SURPRESA — FASE 4: CONTADOR DE DIAS
// ============================================================
function animarContador() {
    const hoje = new Date();
    const diasTotal = Math.max(0, Math.floor((hoje - dataInicio) / (1000 * 60 * 60 * 24)));
    let atual = 0;
    const passo = Math.max(1, Math.floor(diasTotal / 60));
    const timer = setInterval(() => {
        atual = Math.min(atual + passo, diasTotal);
        diasNumEl.textContent = atual;
        if (atual >= diasTotal) clearInterval(timer);
    }, 28);
}

document.getElementById("jogarDeNovoFinal").addEventListener("click", restartGame);

// ============================================================
// MÚSICA DE FUNDO
// ============================================================
function tocarMusica() {
    musicaFundo.volume = 0;
    musicaFundo.play().catch(() => {});
    let v = 0;
    const fade = setInterval(() => {
        v = Math.min(v + 0.02, 0.35);
        musicaFundo.volume = v;
        if (v >= 0.35) clearInterval(fade);
    }, 80);
}

function pararMusica() {
    let v = musicaFundo.volume;
    const fade = setInterval(() => {
        v = Math.max(v - 0.03, 0);
        musicaFundo.volume = v;
        if (v <= 0) { musicaFundo.pause(); musicaFundo.currentTime = 0; clearInterval(fade); }
    }, 60);
}

// ============================================================
// UTILITÁRIO — revelar botão suavemente
// ============================================================
function revelarBotao(btn) {
    btn.style.opacity = "1";
    btn.style.transform = "scale(1)";
    btn.style.pointerEvents = "auto";
}

// ============================================================
// REINICIAR TUDO
// ============================================================
function restartGame() {
    // Reset estado
    tentativas  = 0;
    index       = 0;
    cartaIndex  = 0;
    slideAtual  = 0;
    cooldown    = false;
    jogoAtivo   = false;
    slidesVistos.clear();
    if (cartaTimer) { clearTimeout(cartaTimer); cartaTimer = null; }

    // Reset visuais
    typingText.innerHTML = "";
    cartaEl.innerHTML    = "";
    startBtn.style.opacity   = "0";
    startBtn.style.transform = "scale(0.9)";
    fujao.classList.remove("shake");
    fujao.style.background = "";
    fujao.style.display    = "none";

    // Reset botões de revelar
    [verFotosBtn, verContadorBtn].forEach(btn => {
        btn.style.opacity      = "0";
        btn.style.transform    = "scale(0.9)";
        btn.style.pointerEvents = "none";
    });

    // Reset fases da surpresa
    envelopeEl.classList.remove("abrindo");
    faseEnvelope.classList.remove("escondida");
    faseCarta.classList.add("escondida");
    faseFotos.classList.add("escondida");
    faseContador.classList.add("escondida");

    // Reset telas
    winnerScreen.classList.remove("ativo");
    surpresaScreen.classList.remove("ativo");
    startScreen.style.display = "flex";

    pararMusica();
    gerarCorações();
    typeEffect();
}
