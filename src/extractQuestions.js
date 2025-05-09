const fs = require('fs');
const { parseDocument } = require('htmlparser2');
const { selectAll, selectOne } = require('css-select');
const { textContent } = require('domutils');

function extractQuestions(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    const document = parseDocument(html);

    const questions = [];

    // Seleciona os elementos das perguntas
    const questionElements = selectAll('.result-pane--question-result-pane--sIcOh', document);
    questionElements.forEach((element, index) => {
        // Captura o texto da pergunta e remove espaços extras
        const questionTextElement = selectOne('#question-prompt', element);
        const questionText = questionTextElement ? textContent(questionTextElement).replace(/\s+/g, ' ').trim() : '';

        const options = [];

        // Captura todas as opções de resposta e remove espaços extras
        const optionElements = selectAll('.result-pane--answer-result-pane--Niazi', element);
        optionElements.forEach((optionElement, oIndex) => {
            const optionTextElement = selectOne('#answer-text', optionElement);
            const optionText = optionTextElement ? textContent(optionTextElement).replace(/\s+/g, ' ').trim() : '';
            options.push({
                index: oIndex + 1,
                text: optionText
            });
        });

        // Captura a explicação (se existir) e remove espaços extras
        const explanationElement = selectOne('.overall-explanation-pane--overall-explanation--G-hLQ', element);
        const explanation = explanationElement ? textContent(explanationElement).replace(/\s+/g, ' ').trim() : '';

        // Adiciona a pergunta ao array
        questions.push({
            id: `question${index + 1}`,
            topicId: 42,
            levelId: 1,
            question: questionText,
            options: options,
            answer: [],
            explanation: explanation
        });
    });

    // Analisa as posições das respostas corretas
    questionElements.forEach((element, qIndex) => {
        const optionElements = selectAll('.result-pane--answer-result-pane--Niazi', element);
        optionElements.forEach((optionElement, oIndex) => {
            const isCorrect = selectOne('.answer-result-pane--answer-correct--PLOEU', optionElement);

            if (isCorrect) {
                if (!questions[qIndex]) {
                    questions[qIndex] = { answer: [] };
                }
                questions[qIndex].answer.push(oIndex + 1);
            }
        });

        if (questions[qIndex].answer.length === 0) {
            questions[qIndex].answer = null;
        }
    });

    // Exibe os resultados no console
    questions.forEach((question, index) => {
        console.log(`Question ${index + 1}: ${question.question}`);
        console.log(`Options: ${question.options.map(opt => opt.text).join(', ')}`);
        console.log(`Correct answers: ${question.answer ? question.answer.join(', ') : 'None'}`);
    });

    return { questions };
}

const file = 'simulado-11';

const filePath = `C:/TEMP/AppExtractQuestions/src/htmls/${file}.html`;
console.log(`Lendo arquivo: ${filePath}`);
const result = extractQuestions(filePath);

// Define o caminho do arquivo JSON de saída
const outputFilePath = `C:/TEMP/AppExtractQuestions/src/json/${file}.json`;

// Salva o resultado em um arquivo JSON
fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), 'utf8');

console.log(`Arquivo JSON salvo em: ${outputFilePath}`);