'use strict'

import { openModal, closeModal } from './modal.js'
import { readClients, createClient, deleteClient, updateClient } from './clients.js'

const createRow = ({ nome, email, celular, cidade, id }) => {
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>${nome}</td>
        <td>${email}</td>
        <td>${celular}</td>
        <td>${cidade}</td>
        <td>
            <button type="button" class="button green" onClick="editClient(${id})" ">editar</button>
            <button type="button" class="button red" onClick="delClient(${id})" ">excluir</button>
        </td>
    `
    return row
}

const updateTable = async() => {
    const clientsContainer = document.getElementById('clients-container')

    // Ler a API e armazenar o resultado em uma variavel
    const clients = await readClients("")

    // Preencher a tabela com as informações
    const rows = clients.map(createRow)
    clientsContainer.replaceChildren(...rows)
}

const isEdit = () => document.getElementById('nome').hasAttribute('data-id')

const saveClient = async() => {

    const form = document.getElementById('modal-form')

    // Criar um json com as informações do cliente
    const client = {
        /* "id": "", */
        "nome": document.getElementById('nome').value,
        "email": document.getElementById('email').value,
        "celular": document.getElementById('celular').value,
        "cidade": document.getElementById('cidade').value,
        "foto": document.getElementById('modal-image').src
    }

    if (form.reportValidity()) {
        if (isEdit()) {
            client.id = document.getElementById('nome').dataset.id
            await updateClient(client)
        } else {
            await createClient(client)
        }

        // Fechar a modal
        closeModal()

        // Atualizar a tabela
        updateTable()
    }

}

const fillForm = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.id = client.id
    document.getElementById('modal-image').src = client.foto
        /*     document.getElementById('nome').setAttribute('data-id', client.id)
         */
}

globalThis.editClient = async(id) => {
    // Armazenar as informações do cliente slecionado em uma variavel
    const client = await readClients(id)

    // Preencher o formulário com as informações
    fillForm(client)

    // Abrir a modal no estado de edicao
    openModal()

}

globalThis.delClient = async(id) => {
    await deleteClient(id)
    updateTable()

}

const actionClient = async(event) => {
    if (event.target.type == 'button') {

        const [action, codigo] = event.target.id.split('-')

        if (action == 'editar') {

        } else if (action == 'excluir') {
            await deleteClient(codigo)
            updateTable()
        }
    }
}

const maskCelular = ({ target }) => {
    let text = target.value

    text = text.replace(/[^0-9]/g, '')
    text = text.replace(/(.{2})(.{5})(.{4})/, '($1) $2-$3')
        /* text = text.replace(/(.{7})(.)/, '$1-$2') */
    text = text.replace(/(.{15})(.*)/, '$1')

    target.value = text

}
updateTable()


// Eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('salvar').addEventListener('click', saveClient)
document.getElementById('clients-container').addEventListener('click', actionClient)
document.getElementById('celular').addEventListener('input', maskCelular)