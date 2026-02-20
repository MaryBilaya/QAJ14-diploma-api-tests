import { test, expect } from '../fixtures';
import { createTestBin } from '../helpers/create_test_bin';
import { updateTestBin } from '../helpers/update_test_bin';
import { APIRequestContext } from "playwright/test";

test.describe('Read Bins API', () => {
    //1. Чтение существующего bin с metadata
    test('Read existing bin with metadata @positive', async ({ request, jsonBin }) => {
        const createdBin = await createTestBin(request, {sample: "Creating bin for reading"});
        const { response, response_body } = await jsonBin.readBin(createdBin.bin_id);

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect(response.status()).toBe(200);
        expect(response_body.record.sample).toBe('Creating bin for reading');
        expect(response_body.metadata.id).toBe(createdBin.bin_id);
    });

    //2. Чтение существующего bin без metadata (meta=false)
    test('Read existing bin without metadata @positive', async ({ request, jsonBin }) => {
        const createdBin = await createTestBin(request, {data: "Creating bin for reading"});
        const { response, response_body } = await jsonBin.readBin(createdBin.bin_id, {meta: false});

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect(response.status()).toBe(200);
        expect(response_body.data).toBe("Creating bin for reading");
        expect(response_body).not.toHaveProperty('metadata');
    });

    //3. Чтение bin с невалидным bin_id
    test('Try to read bin with invalid bin_id @negative', async ({ jsonBin }) => {
        const { response, response_body } = await jsonBin.readBin('invalid-bin-id');

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect(response.status()).toBe(400);
        expect(response_body.message).toBe('Invalid Bin Id provided');
    });

    //4. Чтение bin без X-Master-Key
    test('Read bin missing master key @negative', async ({ request }) => {
        const createdBin = await createTestBin(request, {data: "Creating bin"});
        const response = await request.get(`https://api.jsonbin.io/v3/b/${createdBin.bin_id}`, {});
        const response_body = await response.json();

        console.log('STATUS', response.status());
        console.log('BODY', await response.text());

        expect(response.status()).toBe(401);
        expect(response_body.message).toBe("You need to pass X-Master-Key or X-Access-Key in the header to read a private bin");
    });
})