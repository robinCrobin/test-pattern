import { User } from '../../src/domain/User.js';

/**
 * Object Mother para User.
 *
 * Centraliza a criação de usuários "prontos para uso" nos testes,
 * evitando duplicação na montagem de objetos e deixando clara a
 * intenção de cada cenário.
 */
export class UserMother {
    /**
     * Usuário comum (tipo PADRAO), representando o caso mais típico.
     */
    static umUsuarioPadrao() {
        return new User(1, 'Usuário Padrão', 'padrao@email.com', 'PADRAO');
    }

    /**
     * Usuário premium (tipo PREMIUM).
     */
    static umUsuarioPremium() {
        return new User(2, 'Usuário Premium', 'premium@email.com', 'PREMIUM');
    }
}
