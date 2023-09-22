import { table } from "../ui/uiVariables.js";

/*
  --------------------------------------------------------------------------------------
  Função para pegar os itens totais e os itens que estão empacotados
  --------------------------------------------------------------------------------------
*/

function getPercentagePacked() {
  const rows = table.querySelectorAll("tr[data-row-id]");

  let totalItems = 0;
  let checkedItems = 0;

  rows.forEach((row) => {
    totalItems++;
    const checkbox = row.querySelector("input[type='checkbox']");
    if (checkbox && checkbox.checked) {
      checkedItems++;
    }
  });

  return { totalItems: totalItems, checkedItems: checkedItems };
}

/*
  --------------------------------------------------------------------------------------
  Função para remover a classe dos table headers.
  --------------------------------------------------------------------------------------
*/
function removeClassFromTableHeader(tableHeaders) {
  for (let i = 0; i < tableHeaders.length; i++) {
    tableHeaders[i].removeAttribute("class");
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar um tipo específico de dados (usado na ordenação da tabela).
  --------------------------------------------------------------------------------------
*/

function getTextContent(element) {
  return element.textContent.toLowerCase();
}

function getIntegerTextContent(element) {
  return parseInt(element.textContent);
}

function getIfCheckboxChecked(element) {
  return element
    .querySelector("input[type='checkbox']")
    .getAttribute("title")
    .toLowerCase();
}

function getEmojiTextContent(element) {
  return element.textContent.split(" - ")[1].toLowerCase();
}

export {
  getPercentagePacked,
  removeClassFromTableHeader,
  getTextContent,
  getIntegerTextContent,
  getIfCheckboxChecked,
  getEmojiTextContent,
};
