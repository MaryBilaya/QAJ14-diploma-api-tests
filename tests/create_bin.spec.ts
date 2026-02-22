import { test, expect } from '../fixtures';


test.describe('Create Bins API', () => {
    //1. Успешное создание bin с простым JSON (по умолчанию создастся private bin -> X-Bin-Private = true) 
    test('Create private bin (by default) @positive', async ({ jsonBin }) => {
        const { response, response_body } = await jsonBin.createBin({ sample: "Hello World! Case num. 1" });

        expect(response.status()).toBe(200);
        expect(response_body.record.sample).toBe("Hello World! Case num. 1");
        expect(response_body.metadata.id).toBeTruthy();
        expect(response_body.metadata.private).toEqual(true);           
    });

    //2. Создание публичного bin (X-Bin-Private = false) 
    test('Create bin: public bin @positive', async ({ jsonBin }) => {
        const { response, response_body } = await jsonBin.createBin({ sample: "Hello World! Case num. 2"}, { x_bin_private: false });

        expect(response.status()).toBe(200);
        expect(response_body.record.sample).toBe("Hello World! Case num. 2");
        expect(response_body.metadata.private).toEqual(false);
    });

    //3. Создание bin с именем X-Bin-Name
    test('Create bin with name @positive @extended', async ({ jsonBin }) => {
        const { response, response_body } = await jsonBin.createBin({ sample: "Bin with name"}, { x_bin_name: "test name"});

        expect(response.status()).toBe(200);
        expect(response_body.metadata).toHaveProperty('name', 'test name');
    });

    //4. Негативный кейс. Отправка запроса с некорректно заполненным body
    test('Negative case. Create bin: invalid body @negative', async ({ jsonBin }) => {
        const { response, response_body } = await jsonBin.createBin(123);

        expect(response.status()).toBe(400);
        expect(response_body.message).toEqual('Invalid JSON. Please try again');
    });

    //5. Негативный кейс. Отправка запроса с пустым body
    test('Negative case. Create bin: empty body @negative', async ({ jsonBin }) => {
        const { response, response_body } = await jsonBin.createBin(undefined);

        expect(response.status()).toBe(400);
        expect(response_body.message).toBe("Bin cannot be blank");
    });
})