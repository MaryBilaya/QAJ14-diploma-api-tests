import { test, expect } from '../fixtures';
import { createTestBin } from '../helpers/create_test_bin';
import { APIRequestContext } from "playwright/test";

test.describe('Delete Bins API', () => {
    //1. Успешное удаление существующего bin
    test('Delete existing bin @positive', async ({ request, jsonBin }) => {
        const createdBin = await createTestBin(request, { value: 'deletion'});
        const { response, response_body } = await jsonBin.deleteBin(createdBin.bin_id);

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect(response.status()).toBe(200);
        expect(response_body.metadata.id).toEqual(createdBin.bin_id);
        expect(response_body.message).toBe('Bin deleted successfully');
    });

    //2. Попытка повторного удаления того же bin
    test('Attempt to delete the same bin again @negative', async ({ request, jsonBin }) => {
        const createdBin = await createTestBin(request, { value: 'delete twice'});
        await jsonBin.deleteBin(createdBin.bin_id);
        const { response, response_body } = await jsonBin.deleteBin(createdBin.bin_id);

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect([400, 404]).toContain(response.status());
        expect(response_body.message).toBe("Bin not found or it doesn't belong to your account");
    });

    //3. Удаление bin с невалидным bin_id
    test('Delete bin with invalid bin_id @negative', async ({ jsonBin })=> {
        const { response, response_body } = await jsonBin.deleteBin('invalid-bin-id');

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect([400]).toContain(response.status());
        expect(response_body.message).toBe('Invalid Bin Id provided');
    });

    //4. Удаление bin без X-Master-Key
    test('Delete bin withot master key @negative', async ({ request }) => {
        const createdBin = await createTestBin(request, { value: 'delete without key'});
        const response = await request.delete(`https://api.jsonbin.io/v3/b/${createdBin.bin_id}`, {});
        const response_body = await response.json();

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect(response.status()).toBe(401);
        expect(response_body.message).toBe('You need to pass X-Master-Key or X-Access-Key in the header to delete a bin');
    });
})