import { CheckoutService } from '../src/services/CheckoutService.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';
import { Item } from '../src/domain/Item.js';
import { Pedido } from '../src/domain/Pedido.js';

describe('CheckoutService', () => {
    describe('quando o pagamento falha', () => {
        it('deve retornar null (pedido não é criado)', async () => {
            // Arrange
            const carrinho = new CarrinhoBuilder().build();

            // Stub: controla o fluxo retornando sempre falha na cobrança.
            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: false }),
            };

            // Dummies: não devem ser chamados neste cenário.
            const repositoryDummy = { salvar: jest.fn() };
            const emailDummy = { enviarEmail: jest.fn() };

            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryDummy,
                emailDummy
            );

            // Act
            const pedido = await checkoutService.processarPedido(carrinho, '4111-1111-1111-1111');

            // Assert (Verificação de Estado)
            expect(pedido).toBeNull();

            // As dependências seguintes não devem ser acionadas após a falha.
            expect(repositoryDummy.salvar).not.toHaveBeenCalled();
            expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
        });
    });

    describe('quando um cliente Premium finaliza a compra', () => {
        it('deve aplicar 10% de desconto e notificar o cliente por e-mail', async () => {
            // Arrange
            const premium = UserMother.umUsuarioPremium();
            const carrinho = new CarrinhoBuilder()
                .comUser(premium)
                .comItens([new Item('Produto A', 150), new Item('Produto B', 50)]) // R$ 200,00
                .build();

            // Stub: paga com sucesso (controla o fluxo).
            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: true }),
            };

            // Stub: devolve o pedido salvo com um ID.
            const repositoryStub = {
                salvar: jest
                    .fn()
                    .mockImplementation(async (pedido) => new Pedido(99, pedido.carrinho, pedido.totalFinal, pedido.status)),
            };

            // Mock: queremos verificar a interação (foi chamado, com quais argumentos).
            const emailMock = {
                enviarEmail: jest.fn().mockResolvedValue(undefined),
            };

            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryStub,
                emailMock
            );

            // Act
            const pedido = await checkoutService.processarPedido(carrinho, '4111-1111-1111-1111');

            // Assert (Verificação de Comportamento)
            // Desconto de 10% sobre R$ 200,00 => R$ 180,00.
            expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, '4111-1111-1111-1111');

            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
            expect(emailMock.enviarEmail).toHaveBeenCalledWith(
                'premium@email.com',
                'Seu Pedido foi Aprovado!',
                'Pedido 99 no valor de R$180'
            );

            // Verificação de estado complementar: pedido salvo é retornado.
            expect(pedido).not.toBeNull();
            expect(pedido.id).toBe(99);
            expect(pedido.totalFinal).toBe(180);
        });
    });
});
