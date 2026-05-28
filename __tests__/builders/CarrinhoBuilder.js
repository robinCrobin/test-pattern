import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { UserMother } from './UserMother.js';

/**
 * Builder para Carrinho.
 *
 * Começa com um estado padrão válido (um usuário padrão e um item)
 * e expõe métodos fluentes para customizar apenas o que importa em
 * cada cenário de teste. Use .build() para obter a instância final.
 */
export class CarrinhoBuilder {
    constructor() {
        this.user = UserMother.umUsuarioPadrao();
        this.itens = [new Item('Item Padrão', 50)];
    }

    /**
     * Define o usuário dono do carrinho.
     */
    comUser(user) {
        this.user = user;
        return this;
    }

    /**
     * Substitui a lista de itens do carrinho.
     */
    comItens(itens) {
        this.itens = itens;
        return this;
    }

    /**
     * Adiciona um item ao carrinho, preservando os existentes.
     */
    comItem(item) {
        this.itens = [...this.itens, item];
        return this;
    }

    /**
     * Esvazia o carrinho (nenhum item).
     */
    vazio() {
        this.itens = [];
        return this;
    }

    /**
     * Retorna a instância final do Carrinho.
     */
    build() {
        return new Carrinho(this.user, this.itens);
    }
}
