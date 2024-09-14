// Make sure to include these imports:
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define palavras padrao caso não receba um prompt
const palavrasPadrao = [
    "apple", "bread", "beach", "child", "dance", "eagle", "fresh", "green", "heart", "horse", 
    "juice", "knife", "lemon", "mouse", "night", "ocean", "peace", "queen", "river", "smile", 
    "table", "uncle", "voice", "water", "zebra", "brave", "charm", "dream", "enjoy", "frost", 
    "ghost", "happy", "index", "judge", "kingy", "laugh", "magic", "nurse", "olive", "point", 
    "quiet", "right", "start", "tiger", "unity", "valid", "watch", "yield", "zebra", "young",
    "below", "clown", "drive", "event", "force", "grant", "habit", "ideal", "joint", "kneel", 
    "lucky", "medal", "noble", "olive", "party", "query", "raise", "serve", "taste", "union", 
    "value", "waste", "xenia", "yield", "zebra", "awake", "brush", "cream", "diver", "earth", 
    "fault", "grace", "humor", "input", "joker", "knife", "lemon", "metal", "naval", "outer", 
    "pilot", "quest", "radio", "shade", "torch", "unity", "vapor", "watch"
];

// Salva as palavras do array palavrasPadrao no armazenamento local até que seja subscrito 
localStorage.setItem('palavrasGeradas', JSON.stringify(palavrasPadrao));
localStorage.setItem('tema', JSON.stringify("General"));

const API_KEY = "AIzaSyDYrb194r1yd0cwlWvlgx7GbqPoKz9_H80";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const resultadoGeracaoRuim = document.querySelector("#resultadoGeracaoRuim");
const resultadoGeracaoBom = document.querySelector("#resultadoGeracaoBom");

async function gerarPalavras(prompt) {

    const consulta = [
        {text: "Generate the maximum number of words in English with exactly 5 letters separated by commas. Only words with 5 letters from A to Z, try to generate as many words as possible. The theme of the generated words is defined by the user"},
        {text: "input: food"},
        {text: "output: apple, bread, lemon, juice, olive, cream, grape, melon, honey, sugar, spice"},
        {text: "input: cinema"},
        {text: "output: actor, scene, frame, light, focus, score, genre, flash, stand, angle, shoot"},
        {text: `input: the theme is ${prompt}`},
        {text: "output: "},
      ];

    try {
        const result = await model.generateContent(consulta);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        // Limpar o texto e retornar o array de palavras
        return limparTexto(text);
    } catch (error) {
        console.error("Error generating words:", error);
        resultadoGeracaoRuim.textContent = "An error occurred while generating the words. Please try again.";
        return [];
    }
}

function limparTexto(texto) {
    // Separar a string em um array usando a vírgula como separador e remover espaços em branco
    const palavras = texto.split(', ').map(palavra => palavra.trim());

    // Expressão regular para verificar caracteres especiais
    const regex = /[^a-zA-Zà-úÀ-Ú ]/g;

    // Normalizar todos os nomes de uma vez e filtrar as palavras válidas
    return palavras.map(palavra => palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, "")).filter(palavra => !regex.test(palavra) && palavra.length === 5);
}

function desativaBotao() {

    const botaoPlay = document.querySelector("#botao-play");

    botaoPlay.disabled = true;

}



function ativaBotao() {

    const botaoPlay = document.querySelector("#botao-play");

    botaoPlay.disabled = false;

    botaoPlay.innerText = "PLAY";

}

// Seleciona o botão play
const botao = document.getElementById('botao-play');

// Adiciona o evento de clique ao botão play
botao.onclick = function() {
    // Redireciona para a outra página
    window.location.href = "tabela.html";
};


document.querySelector("#Confirmar_prompt").addEventListener("click", async () => {
    desativaBotao();
    resultadoGeracaoRuim.textContent = "";
    const prompt = document.querySelector("#input_prompt").value;

    if (prompt === "") {
        resultadoGeracaoRuim.textContent = "Enter a theme above.";
        ativaBotao();
        return;
    }

    const palavras = await gerarPalavras(prompt);

    if (palavras.length > 0) {
        // Armazenar as palavras no localStorage como um JSON
        localStorage.setItem('palavrasGeradas', JSON.stringify(palavras));
        localStorage.setItem('tema', JSON.stringify(prompt));
        resultadoGeracaoBom.textContent = `Game on the topic ${prompt} created`;
        ativaBotao();
    } else {
        resultadoGeracaoRuim.textContent = "No words found.";
        ativaBotao();
    }
});
