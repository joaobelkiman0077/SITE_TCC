const questions = [
    { question: "Qual é a sua cor favorita?", options: ["Azul", "Verde", "Vermelho"] },
    { question: "Qual é o seu animal favorito?", options: ["Cachorro", "Gato", "Pássaro"] },
    { question: "Qual é o seu esporte favorito?", options: ["Futebol", "Basquete", "Tênis"] },
];

let currentQuestionIndex = 0;
let answers = [];

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').value = question.question;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ''; // Limpar opções anteriores

    question.options.forEach((option, index) => {
        const optionHtml = `
            <button type="button" class="btn btn-outline-primary mt-2 option-btn" data-value="${option}">
                ${option}
            </button>
        `;
        optionsContainer.insertAdjacentHTML('beforeend', optionHtml);
    });
}

function addAnswerToTable(question, answer) {
    answers.push({ question, answer });
    console.log(`Pergunta: ${question}, Resposta: ${answer}`);
}

function sendAnswersToAPI() {
    fetch('https://sua-api-url.com/endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta da API:', data);
    })
    .catch(error => {
        console.error('Erro ao enviar os dados para a API:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();

    document.getElementById('options-container').addEventListener('click', (event) => {
        if (event.target.classList.contains('option-btn')) {
            const selectedValue = event.target.getAttribute('data-value');
            const currentQuestion = questions[currentQuestionIndex];
            
            addAnswerToTable(currentQuestion.question, selectedValue);

            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                alert('Você completou todas as perguntas.');
                document.getElementById('dynamic-form').classList.add('hidden');
                sendAnswersToAPI(); // Enviar respostas para a API
            } else {
                loadQuestion();
            }
        }
    });
});
