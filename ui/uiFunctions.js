import categoryObject from "../data/categoryObject.js";

import {
  postItem,
  deleteItem,
  updateItem,
  getList,
  travelTypeElement,
} from "../api/apiRequests.js";

import {
  removeClassFromTableHeader,
  getPercentagePacked,
  getTextContent,
  getIntegerTextContent,
  getIfCheckboxChecked,
  getEmojiTextContent,
} from "../utils/functionUtils.js";

import { table, tableHeaders, itemCountsElement } from "./uiVariables.js";

let ascendingSortedObject = {};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (itemName, quantity, category, id, is_packed = false) => {
  let item = [
    `${categoryObject[category]} - ${itemName}`,
    quantity,
    category,
    is_packed,
  ];
  let row = table.insertRow();

  row.setAttribute("data-row-id", id);

  for (let i = 0; i < item.length; i++) {
    let cell = row.insertCell(i);
    if (i === item.length - 1 && typeof item[i] === "boolean") {
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item[i];

      //Esse title será usado para ordenar os checkbox
      checkbox.title = item[i] ? "Checked" : "Unchecked";

      cell.appendChild(checkbox);
    } else {
      cell.textContent = item[i];
    }
  }
  insertButton(row.insertCell(-1));

  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
};

/*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */

const deleteRow = (event) => {
  if (event.target.classList.contains("close")) {
    let tableRow = event.target.parentElement.parentElement;
    const id = tableRow.getAttribute("data-row-id");
    tableRow.remove();
    deleteItem(id);
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para alterar um item da lista de acordo com o click no checkbox
  --------------------------------------------------------------------------------------
*/
function updateElement(event) {
  {
    if (event.target.type === "checkbox") {
      let checkbox = event.target;
      let tr = checkbox.closest("tr");
      let rowId = tr.getAttribute("data-row-id");

      updateItem(checkbox.checked, rowId);
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let button = document.createElement("button");
  let txt = document.createTextNode("\u00D7");
  button.className = "close";
  button.appendChild(txt);
  parent.appendChild(button);
};

/*
  --------------------------------------------------------------------------------------
  Função para remover todos os items da lista
  --------------------------------------------------------------------------------------
*/
const removeAllElements = () => {
  const elementsToRemove = table.querySelectorAll("tr[data-row-id]");
  elementsToRemove.forEach((element) => {
    element.remove();
  });
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputItem = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputCategory = document.getElementById("newCategory").value;

  if (inputItem === "") {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputItem, inputQuantity, inputCategory);
    postItem(inputItem, inputQuantity, inputCategory);
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para atualizar a contagem dos itens.
  --------------------------------------------------------------------------------------
*/

function updateItemCount() {
  const percentagePackedDictionary = getPercentagePacked();
  const percentage = Math.round(
    (percentagePackedDictionary.checkedItems /
      percentagePackedDictionary.totalItems) *
      100
  );

  const itemCountText =
    percentage === 100
      ? `✈️ Você já empacotou todos os itens da sua lista!`
      : percentagePackedDictionary.totalItems
      ? `💼 Você tem ${percentagePackedDictionary.totalItems} itens na sua lista, e você já empacotou ${percentagePackedDictionary.checkedItems} (${percentage}%)`
      : `Comece a adicionar itens à sua bagagem! 💼`;

  itemCountsElement.textContent = itemCountText;
}

/*
  --------------------------------------------------------------------------------------
  Função que atualiza o value do droplist de tipo de viagem e armazena seu valor no localStorage.
  --------------------------------------------------------------------------------------
*/

function setTravelType() {
  const storedTravelType = localStorage.getItem("typeOfTravelId");

  travelTypeElement.value = storedTravelType ? storedTravelType : "1";

  if (!storedTravelType) {
    localStorage.setItem("typeOfTravelId", travelTypeElement.value);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar a tabela ao mudar o tipo da viagem.
  --------------------------------------------------------------------------------------
*/

function onChangeTravelType() {
  // Update the typeOfTravel variable when the selection changes
  removeAllElements();
  getList();
  removeClassFromTableHeader(tableHeaders);
  localStorage.setItem("typeOfTravelId", travelTypeElement.value);
}

/*
  --------------------------------------------------------------------------------------
  Funções para Ordenar os itens da tabela
  --------------------------------------------------------------------------------------
*/

/*
    --------------------------------------------------------------------------------------
    Função para adicionar Event Handlers para ordenar a tabela quando clicado
    --------------------------------------------------------------------------------------
*/

function initializeTableHeaderSorting() {
  for (let columnIndex = 0; columnIndex < tableHeaders.length; columnIndex++) {
    let tableColumn = tableHeaders[columnIndex];
    let tableColumnType = tableColumn.getAttribute("column-type");
    if (!tableColumnType) {
      continue;
    }
    tableColumn.addEventListener(
      "click",
      createSortHandler(columnIndex, tableColumnType)
    );
  }
}

/*
    --------------------------------------------------------------------------------------
    Função para adicionar a classe nos headers que serão ordenados e chamar a função que ordena
    --------------------------------------------------------------------------------------
*/

function createSortHandler(columnIndex, tableColumnType) {
  return function () {
    sortTable(columnIndex, tableColumnType);
    ascendingSortedObject[columnIndex] = !ascendingSortedObject[columnIndex];

    const headersArray = Array.from(tableHeaders);

    headersArray.forEach((th) => {
      th.classList.remove("th-sort-asc", "th-sort-desc");
    });

    tableHeaders[columnIndex].classList.toggle(
      "th-sort-asc",
      !ascendingSortedObject[columnIndex]
    );
    tableHeaders[columnIndex].classList.toggle(
      "th-sort-desc",
      ascendingSortedObject[columnIndex]
    );
  };
}

/*
    --------------------------------------------------------------------------------------
    Função para ordenar a tabela de acordo com o tipo da coluna
    --------------------------------------------------------------------------------------
*/
function sortTable(columnIndex, tableColumnType) {
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;

  let dataTransformFunction;

  if (tableColumnType === "string") {
    dataTransformFunction = getTextContent;
  }

  if (tableColumnType === "emoji-string") {
    dataTransformFunction = getEmojiTextContent;
  }

  if (tableColumnType === "integer") {
    dataTransformFunction = getIntegerTextContent;
  }

  if (tableColumnType === "checkbox") {
    dataTransformFunction = getIfCheckboxChecked;
  }

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      const xValue = dataTransformFunction(
        rows[i].getElementsByTagName("td")[columnIndex]
      );
      const yValue = dataTransformFunction(
        rows[i + 1].getElementsByTagName("td")[columnIndex]
      );

      if (ascendingSortedObject[columnIndex]) {
        if (xValue > yValue) {
          shouldSwitch = true;
          break;
        }
      } else if (!ascendingSortedObject[columnIndex]) {
        if (xValue < yValue) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

export {
  insertList,
  updateElement,
  insertButton,
  removeAllElements,
  sortTable,
  deleteRow,
  newItem,
  onChangeTravelType,
  updateItemCount,
  initializeTableHeaderSorting,
  setTravelType,
};
