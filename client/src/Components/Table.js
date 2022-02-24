import axios from 'axios'
import { Component, Fragment, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { PlusIcon } from '@heroicons/react/solid'

/* This example requires Tailwind CSS v2.0+ */
const contacts = []

export default class Table extends Component {

  constructor(props) {
    super(props);

    this.state = { contacts: [], editing: null, modal: false };
  }

  fetchContacts() {
    axios.get('/api/contatos').then(response => { this.setContacts(response.data) });
  }

  setContacts = (contacts) => {
    this.setState({ contacts: contacts });
  }

  setEditing = (contact) => {
    this.setState({ editing: contact === null ? null : { ...contact } });
  }

  setModal = (state) => {
    this.setState({ modal: state == 'open' ? true : false });
  }

  handleEditingInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name === 'imagem_url' && value.length > 0 && !value.startsWith('http')) {
      value = 'http://' + value;
    }

    this.setEditing({
      ...this.state.editing,
      [name]: value
    })
  }

  editContactFormSubmit = (event) => {
    event.preventDefault();

    axios.put('/api/contatos/' + this.state.editing.id, this.state.editing).then(() => {
      this.setEditing(null)
      this.fetchContacts()
    })
  }

  deleteContact = (contact) => {
    axios.delete('/api/contatos/' + contact.id).then(() => {
      this.fetchContacts()
    })
  }

  addContact = () => {
    axios.post('/api/contatos', {
      "imagem_url": "https://avatars.dicebear.com/api/micah/" + (Math.random() + 1).toString(36).substring(7) +".svg",
      "nome": "Novo Contato",
      "email": "",
      "telefone": ""
    }).then(() => {
      this.fetchContacts()
    })
  }

  componentWillMount() {
    this.fetchContacts();
  }

  render() {
    return (
      <div className="flex flex-col">
        <Transition.Root show={this.state.modal} as={Fragment}>
          <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => this.setModal('close')}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                        <img className="h-8 w-8 rounded-full" src={this.state.editing?.imagem_url} alt=""/>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                          URL da foto do contato
                        </Dialog.Title>
                        <div className="pt-4">
                              <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                  http://
                                </span>
                                <input
                                  type="text"
                                  value={this.state.editing?.imagem_url}
                                  name="imagem_url"
                              onChange={(event) => {
                                this.handleEditingInputChange(event)
                              }}
                                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                  placeholder="www.example.com"
                                />
                              </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => this.setModal('close')}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <form action="" onSubmit={this.editContactFormSubmit.bind(this)} id="contact-form">
              </form>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Telefone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                  this.state.contacts.map((contact) => (
                     this.state.editing?.id === contact.id ?
                        <tr key={contact.email}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={this.state.editing?.imagem_url} alt="" onClick={ () => this.setModal("open") }/>
                                <input type="hidden" value={this.state.editing?.imagem_url} form="contact-form" name="imagem_url" onChange={(event) => this.handleEditingInputChange(event)} />
                              </div>
                            <div className="ml-4 flex-shrink-1">
                                <input required type="text" className="text-sm font-medium text-gray-900" value={this.state.editing?.nome} form="contact-form" name="nome" onChange={(event) => this.handleEditingInputChange(event)} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input required type="text" className="text-sm text-gray-900" value={this.state.editing?.telefone} form="contact-form" name="telefone" onChange={(event) => this.handleEditingInputChange(event)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input required type="email" className="text-sm text-gray-900" value={this.state.editing?.email} form="contact-form" name="email" onChange={(event) => this.handleEditingInputChange(event)} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="
                            ">
                            <button className="text-indigo-600 hover:text-indigo-900" type="submit" form="contact-form" name="submit" id="edit-submit">
                              Salvar
                            </button>
                            </div>
                          </td>
                        </tr>
                       :
                        <tr key={contact.email} className={this.state.editing === null ? "" : "opacity-60"}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={contact.imagem_url} alt="" />
                              </div>
                              <div className="ml-4">
                                <span className="text-sm font-medium text-gray-900">{contact.nome}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{contact.telefone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{contact.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={this.setEditing.bind(this, contact)}>
                              Editar
                            </button>
                            <button className="text-red-600 hover:text-red-900" onClick={this.deleteContact.bind(this, contact)}>
                              Apagar
                            </button>
                          </td>
                        </tr>
                  ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button
          onClick={this.addContact}
          className="flex justify-center items-center mt-4 h-16 w-full text-sm font-medium border-gray-300 border-dashed border-2 transition rounded-lg text-gray-300 hover:text-gray-500 hover:border-gray-500">
          <PlusIcon class="w-6 h-6 mr-2"></PlusIcon>

          Novo contato
        </button>
      </div>
    )
  }
}

