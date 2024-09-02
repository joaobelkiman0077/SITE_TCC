const form = document.getElementById('dynamic-form');
const questionField = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');

let currentQuestionIndex = 0;
const responses = {};

const questions = [
    { question: "Qual o seu gênero?", options: ["Masculino", "Feminino"], jsonKey: "genero" },
    { question: "Qual é a sua idade?", options: [], jsonKey: "idade", type: 'numeric' },
    { question: "Possui hipertensão?", options: ["Sim", "Não"], jsonKey: "hipertensao" },
    { question: "Possui doença cardíaca?", options: ["Sim", "Não"], jsonKey: "doenca_cardiaca" },
    { question: "É casado?", options: ["Sim", "Não"], jsonKey: "casado" },
    { question: "Tipo de trabalho?", options: ["Privado", "Conta própria", "Governamental"], jsonKey: "tipo_trabalho" },
    { question: "Tipo de residência?", options: ["Rural", "Urbano"], jsonKey: "tipo_residencia" },
    { question: "Nível de glicose?", options: [], jsonKey: "nivel_glicose", type: 'numeric' },
    { question: "Qual o seu IMC?", options: [], jsonKey: "imc", type: 'imc' },
    { question: "Qual caso se encaixa quanto ao cigarro?", options: ["Fuma", "Fumou anteriormente", "Nunca fumou"], jsonKey: "condicao_fumante" }
];

function calculateIMC(weight, height) {
    return (weight / (height * height)).toFixed(2);
}

function convertYesNoToNumeric(answer) {
    return answer === 'Sim' ? 1 : 0;
}

function loadQuestion(index) {
    const currentQuestion = questions[index];
    questionField.value = currentQuestion.question;
    optionsContainer.innerHTML = '';

    if (currentQuestion.type === 'imc') {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group custom-input-group w-50';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'input-value';
        input.className = 'form-control w-50';
        input.placeholder = 'Insira seu IMC ou calcule';
        input.style.fontSize = '0.9rem';  // Ajuste de fonte

        const imcButton = document.createElement('button');
        imcButton.className = 'btn btn-outline-secondary btn-sm';
        imcButton.type = 'button';
        imcButton.textContent = 'Calcular IMC';
        imcButton.addEventListener('click', () => {
            openIMCCalculator(input);
        });

        inputGroup.appendChild(input);
        inputGroup.appendChild(imcButton);
        optionsContainer.appendChild(inputGroup);

        const submitButton = document.createElement('button');
        submitButton.className = 'btn btn-primary btn-sm btn-submit w-50';
        submitButton.type = 'button';
        submitButton.textContent = 'Enviar';
        submitButton.addEventListener('click', () => {
            const inputValue = input.value.trim();
            if (inputValue) {
                responses[currentQuestion.jsonKey] = parseFloat(inputValue);
                nextQuestion();
            } else {
                alert('Por favor, insira um valor');
            }
        });

        optionsContainer.appendChild(submitButton);
    } else if (currentQuestion.type === 'numeric') {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group custom-input-group w-50';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control w-50';
        input.placeholder = `Insira ${currentQuestion.question.split(' ')[2].toLowerCase()}`;
        input.style.fontSize = '0.9rem';

        inputGroup.appendChild(input);
        optionsContainer.appendChild(inputGroup);

        const submitButton = document.createElement('button');
        submitButton.className = 'btn btn-primary btn-sm btn-submit w-50';
        submitButton.type = 'button';
        submitButton.textContent = 'Enviar';
        submitButton.addEventListener('click', () => {
            const inputValue = input.value.trim();
            if (inputValue) {
                const numericValue = parseFloat(inputValue);
                responses[currentQuestion.jsonKey] = isNaN(numericValue) ? inputValue : numericValue;
                nextQuestion();
            } else {
                alert('Por favor, insira um valor');
            }
        });

        optionsContainer.appendChild(submitButton);
    } else {
        if (currentQuestion.options.length > 0) {
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-primary btn-sm mt-2 option-btn';
                button.type = 'button';
                button.textContent = option;
                button.setAttribute('data-value', option);
                button.addEventListener('click', () => {
                    let responseValue = option;
                    if (currentQuestion.jsonKey === 'hipertensao' || currentQuestion.jsonKey === 'doenca_cardiaca') {
                        responseValue = convertYesNoToNumeric(option);
                    }
                    responses[currentQuestion.jsonKey] = responseValue;
                    nextQuestion();
                });

                optionsContainer.appendChild(button);
            });
        }
    }
}

function openIMCCalculator(input) {
    const weight = prompt("Insira seu peso em kg (use ponto para decimais, ex: 70.5):");
    if (weight.includes(',')) {
        alert('Por favor, use ponto (.) ao invés de vírgula (,) para separar as casas decimais.');
        return;
    }

    const height = prompt("Insira sua altura em metros (use ponto para decimais, ex: 1.75):");
    if (height.includes(',')) {
        alert('Por favor, use ponto (.) ao invés de vírgula (,) para separar as casas decimais.');
        return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum) || weightNum <= 0 || heightNum <= 0) {
        alert('Entrada inválida. Por favor, insira números válidos.');
        return;
    }

    const imc = calculateIMC(weightNum, heightNum);
    input.value = imc;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        sendResponses();
    }
}

function sendResponses() {
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responses)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta da API:', data);
        alert('As respostas foram enviadas com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao enviar as respostas:', error);
        alert('Houve um erro ao enviar as respostas.');
    });
}

loadQuestion(currentQuestionIndex);
