import { test, expect } from '../fixtures';


test.describe('Delete Bins API', () => {
    let binId: string;

    test.beforeEach(async ({ jsonBin }) => {
        const createdBin = await jsonBin.createBin({ value: 'for delete tests'}); 

        if (!createdBin.bin_id) {
            throw new Error('createBin did not return bin_id');
        }

        binId = createdBin.bin_id;
    });

    //1. Успешное удаление существующего bin
    test('Delete existing bin @positive', async ({ jsonBin }) => {
        const { response, response_body } = await jsonBin.deleteBin(binId);

        expect(response.status()).toBe(200);
        expect(response_body.metadata.id).toBe(binId);
        expect(response_body.message).toBe('Bin deleted successfully');

        //проверяю, что bin действительно удален из базы
        const { response: readResponse, response_body: readBody } = await jsonBin.readBin(binId);

        expect(readResponse.status()).toBe(404);
        expect(readBody.message).toBe("Bin not found or it doesn't belong to your account");
    });

    //2. Попытка повторного удаления того же bin
    test('Attempt to delete the same bin again @negative', async ({ jsonBin }) => {
        await jsonBin.deleteBin(binId);
        const { response, response_body } = await jsonBin.deleteBin(binId);

        expect([404]).toContain(response.status());
        expect(response_body.message).toBe("Bin not found or it doesn't belong to your account");
    });

    //3. Удаление bin с невалидным bin_id
    test('Delete bin with invalid bin_id @negative', async ({ jsonBin })=> {
        const { response, response_body } = await jsonBin.deleteBin('invalid-bin-id');

        expect([400]).toContain(response.status());
        expect(response_body.message).toBe('Invalid Bin Id provided');
    });

    //4. Удаление bin без X-Master-Key
    test('Delete bin without master key @negative', async ({ request }) => {
        const response = await request.delete(`https://api.jsonbin.io/v3/b/${binId}`, {});
        const response_body = await response.json();

        console.log('Delete STATUS', response.status());
        console.log('Delete BODY', await response.text());

        expect(response.status()).toBe(401);
        expect(response_body.message).toBe('You need to pass X-Master-Key or X-Access-Key in the header to delete a bin');
    });
})