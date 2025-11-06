/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
const caminho = 'usuarios'

  it('Deve validar contrato de usuários', () => {
      cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)
      }) 
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: caminho,
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });
  
  it('Deve cadastrar um usuário com sucesso', () => {
    let userEmail = `auto_user_${Math.floor(Math.random() * 100000000)}@auto.com`
    cy.log(userEmail)  
    cy.request({
          method: 'POST',
          url: caminho,
          body: {
              "nome": 'auto_user',
              "email": userEmail,
              "password": 'teste',
              "administrador": 'true'
          }
      }).then((response) => {
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          
        })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: caminho,
      body: {
        "nome": 'auto_user',
        "email": 'auto_user@auto.com',
        "password": 'teste',
        "administrador": 'true'
      },
      failOnStatusCode: false
    }).should((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Este email já está sendo usado')

    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request(caminho).then(response => {
        let id = response.body.usuarios[0]._id
        cy.request({
            method: 'PUT', 
            url: `${caminho}/${id}`,
            body: 
            {
                "nome": "edit_auto_user",
                "email": 'edit_auto_user@auto.com',
                "password": "edit_password",
                "administrador": 'false'
            }
        }).then(response => {
            expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let userEmail = `auto_user_${Math.floor(Math.random() * 100000000)}@auto.com`
    cy.cadastrarUsuario('auto_user', userEmail, 'teste', 'true', caminho)
    .then(response => {
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `${caminho}/${id}`
      })
      .then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
      })
    })
  });

});
