const fs = require('fs');
const { parseDocument } = require('htmlparser2');
const { selectAll, selectOne } = require('css-select');
const { textContent } = require('domutils');

function extractQuestions(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    const document = parseDocument(html);

    const questions = [];

    const questionElements = selectAll('.result-pane--question-result-pane--sIcOh', document);
    questionElements.forEach((element, index) => {
        const questionText = selectAll('#question-prompt p', element)
            .map(p => textContent(p).trim())
            .join(' ')
            .replace(/\s+/g, ' ');

        const options = [];

        // Captura todas as opções de resposta
        const optionElements = selectAll('.result-pane--answer-result-pane--Niazi', element);
        optionElements.forEach((optionElement, oIndex) => {
            const optionText = textContent(selectOne('.rt-scaffolding p', optionElement)).trim();
            options.push({
                index: oIndex + 1,
                text: optionText
            });
        });

        const explanation = selectAll('.overall-explanation-pane--overall-explanation--G-hLQ p', element)
            .map(p => textContent(p).trim())
            .join(' ')
            .replace(/\s+/g, ' ');

        // Adiciona a pergunta ao array
        questions.push({
            id: `question${index + 1}`,  // Interpolação correta
            topicId: 42, 
            levelId: 1, 
            question: questionText,
            options: options,
            answer: [], // Inicializa corretamente para evitar 'undefined'
            explanation: explanation
        });
    });

    // Analisa as posições das respostas corretas
    questionElements.forEach((element, qIndex) => {
        const optionElements = selectAll('.result-pane--answer-result-pane--Niazi', element);
        optionElements.forEach((optionElement, oIndex) => {
            const isCorrect = selectOne('.answer-result-pane--answer-correct--PLOEU', optionElement);

            if (isCorrect) {
                // Certifica-se de que a questão está inicializada
                if (!questions[qIndex]) {
                    questions[qIndex] = { answer: [] }; // Inicializa corretamente
                }
                questions[qIndex].answer.push(oIndex + 1);
            }
        });

        // Se não encontrou resposta correta, define como null
        if (questions[qIndex].answer.length === 0) {
            questions[qIndex].answer = null;
        }
    });

    // Exibe os resultados no console
    questions.forEach((question, index) => {
        console.log(`Question ${index + 1} correct answers: ${question.answer ? question.answer.join(', ') : 'None'}`);
    });

    return { questions };
}

const file = 'simulado-6'

const filePath = `C:/TEMP/AppExtractQuestions/src/htmls/${file}.html`;
const result = extractQuestions(filePath);

// Define o caminho do arquivo JSON de saída
const outputFilePath = `C:/TEMP/AppExtractQuestions/src/json/${file}.json`;

// Salva o resultado em um arquivo JSON
fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), 'utf8');

console.log(`Arquivo JSON salvo em: ${outputFilePath}`);
