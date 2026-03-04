import { test, expect } from '../fixtures';


test.describe('Create Bins API', () => {
    //1. Успешное создание bin с простым JSON (по умолчанию создастся private bin -> X-Bin-Private = true) 
    test('Create private bin (by default) @positive', async ({ jsonBin }) => {
        const { response, response_body, bin_id } = await jsonBin.createBin({ sample: "Hello World! Case num. 1" });

        expect(response.status()).toBe(200);
        expect(response_body.record.sample).toBe("Hello World! Case num. 1");
        expect(response_body.metadata.id).toBeTruthy();
        expect(response_body.metadata.private).toBe(true);  
        expect(bin_id).toBeDefined();                                        //проверка, что bin_id определена и не равна underfined

        //проверяю, что данные реально сохранились в базу
        const readId = bin_id as string;
        const { response: readResponse, response_body: readBody } = await jsonBin.readBin(readId);

        expect(readResponse.status()).toBe(200);
        expect(readBody.record.sample).toBe("Hello World! Case num. 1");
        expect(readBody.metadata.id).toBe(readId);
    });

    //2. Создание публичного bin (X-Bin-Private = false) 
    test('Create bin: public bin @positive', async ({ jsonBin }) => {
        const { response, response_body, bin_id } = await jsonBin.createBin({ sample: "Hello World! Case num. 2"}, { x_bin_private: false });

        expect(response.status()).toBe(200);
        expect(response_body.record.sample).toBe("Hello World! Case num. 2");
        expect(response_body.metadata.private).toBe(false);
        expect(bin_id).toBeDefined();                                           //проверка, что bin_id определена и не равна undefined

        //проверяю, что данные реально сохранились в базу
        const readId = bin_id as string;
        const { response: readResponse, response_body: readBody } = await jsonBin.readBin(readId);

        expect(readResponse.status()).toBe(200);
        expect(readBody.record.sample).toBe("Hello World! Case num. 2");
        expect(readBody.metadata.private).toBe(false);
        expect(readBody.metadata.id).toBe(readId);
    });

    //3. Создание bin с именем X-Bin-Name
    test('Create bin with name @positive @extended', async ({ jsonBin }) => {
        const { response, response_body, bin_id } = await jsonBin.createBin({ sample: "Bin with name"}, { x_bin_name: "test name"});

        expect(response.status()).toBe(200);
        expect(response_body.metadata).toHaveProperty('name', 'test name');
        expect(bin_id).toBeDefined();

        //проверяю, что данные реально сохранились в базу
        const readId = bin_id as string;
        const { response: readResponse, response_body: readBody } = await jsonBin.readBin(readId);

        expect(readResponse.status()).toBe(200);
        expect(readBody.metadata.name).toBe("test name");
        expect(readBody.metadata.id).toBe(readId);
    });

    //4. Негативный кейс. Отправка запроса с некорректно заполненным body
    test('Negative case. Create bin: invalid body @negative', async ({ jsonBin }) => {
        const { response, response_body, bin_id } = await jsonBin.createBin(123);

        expect(response.status()).toBe(400);
        expect(response_body.message).toBe('Invalid JSON. Please try again');
        expect(response_body.metadata).toBeUndefined();
        expect(bin_id).toBeUndefined();
    });

    //5. Негативный кейс. Отправка запроса с пустым body
    test('Negative case. Create bin: empty body @negative', async ({ jsonBin }) => {
        const { response, response_body, bin_id } = await jsonBin.createBin(undefined);

        expect(response.status()).toBe(400);
        expect(response_body.message).toBe("Bin cannot be blank");
        expect(response_body.metadata).toBeUndefined();
        expect(bin_id).toBeUndefined();
    });
})