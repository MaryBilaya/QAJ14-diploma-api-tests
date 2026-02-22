import { test, expect } from '../fixtures';


test.describe('Update Bins API', () => {
    //1. Успешное обновление bin
    test('Successful bin updating @positive', async ({ jsonBin }) => {
        const { response_body: create_body } = await jsonBin.createBin({ sample: "first step. create"});
        const binId = create_body.metadata.id;

        const updateData = { sample: "second step. update" };
        const { response, response_body } = await jsonBin.updateBin(binId, updateData);

        expect(response.status()).toBe(200);
        expect(response_body.record).toEqual(updateData);
        expect(response_body.metadata.parentId).toBe(binId);

        //проверяю, что данные действительно изменились в базе
        const { response: readResponse, response_body: readBody } = await jsonBin.readBin(binId);

        expect(readResponse.status()).toBe(200);
        expect(readBody.record).toEqual(updateData);
    });

    //2. Обновление с версионированием (X-Bin-Version = true)
    test('Update with X-Bin-Version = true @positive @extended', async ({ jsonBin }) => {
        const { response_body: create_body } = await jsonBin.createBin({ sample: "version 1"});
        const binId = create_body.metadata.id;

        const updateData = { sample: "version 2" };
        const { response, response_body } = await jsonBin.updateBin(binId, updateData, {binVersioning: true});

        expect([403]).toContain(response.status());
        expect(response_body.message).toBe("Versioning is not available for the Free users. Upgrade to Pro plan http://api.jsonbin.io/pricing to avail this feature")
    });

    //3. Обновление с невалидным binId
    test('Updating with invalid binId @negative', async ({ jsonBin }) => {
        await jsonBin.createBin({ sample: "create bin"});

        const updateData = { sample: "update bin" };
        const invalidId = "nfchsncflSLVclnh";

        const { response, response_body } = await jsonBin.updateBin(invalidId, updateData);

        expect([400]).toContain(response.status());
        expect(response_body.message).toBe("Invalid Bin Id provided");
    });

    //4. Обновление с пустым data
    test('Update with empty data @negative', async ({ jsonBin }) => {
        const { response_body: create_body } = await jsonBin.createBin({ sample: "version 1"});
        const binId = create_body.metadata.id; 
        
        const updateData = {};

        const { response, response_body } = await jsonBin.updateBin(binId, updateData);

        expect([400]).toContain(response.status());
        expect(response_body.message).toBe("Bin cannot be blank");
    });

    //5. Обнолвение без передачи X-Master-Key
    test('Updating without X-Master-Key @negative', async ({ jsonBin, request }) => {
        const { response_body: create_body } = await jsonBin.createBin({ sample: "Hello World!"});    
        const binId = create_body.metadata.id;

        const updateData = { sample: "Hello Mary!" };

        const response = await request.put(`/v3/b/${binId}`, {
            headers: {
            'Content-Type': 'application/json'},
            data: updateData    
        });

        console.log('Update STATUS', response.status());
        console.log('Update BODY', await response.text());

        const response_body = await response.json();

        expect(response.status()).toBe(401);
        expect(response_body.message).toBe("You need to pass X-Master-Key or X-Access-Key in the header to update a private bin");
    });
}) 