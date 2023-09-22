import { insertList, updateItemCount } from "../ui/uiFunctions.js";
import { travelTypeElement } from "../ui/uiVariables.js";
import apiBaseURL from "./apiBaseURL.js";

/*
  --------------------------------------------------------------------------------------
  GET REQUEST: Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = `${apiBaseURL}/pack/${travelTypeElement.value}`;
  fetch(url, {
    method: "get",
  })
    .then((response) => response.json())
    .then((data) => {
      data.items.forEach((item) => {
        insertList(
          item.name,
          item.quantity,
          item.category,
          item.id,
          item.is_packed
        );
      });
      updateItemCount();
    })

    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  POST REQUEST: Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputCategory) => {
  let typeOfTravelId = travelTypeElement.value;
  const itemData = {
    name: inputProduct,
    quantity: inputQuantity,
    category: inputCategory,
    is_packed: false,
    pack_id: typeOfTravelId,
  };

  const jsonData = JSON.stringify(itemData);

  let url = `${apiBaseURL}/item`;
  fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  PUT REQUEST: Função para modificar um item na lista do servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const updateItem = async (is_packed, item_id) => {
  const itemData = { is_packed: is_packed };
  // Convert the object to a JSON string
  const jsonData = JSON.stringify(itemData);

  let url = `${apiBaseURL}/item/${item_id}`;
  fetch(url, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  DELETE REQUEST: Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (itemId) => {
  let url = `${apiBaseURL}/item/${itemId}`;
  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

export { getList, postItem, updateItem, deleteItem, travelTypeElement };
