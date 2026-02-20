import { APIRequestContext, expect } from "playwright/test";

export async function createTestBin(request: APIRequestContext, data: any) {
    const response = await request.post('/v3/b', {
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': process.env.X_Master_Key as string,
        }, 
        data,
    });

    if (!response.ok()) {
        const text = await response.text();
        console.error('Create bin failed:', response.status(), text);
    }

    const response_body = await response.json();
    const bin_id = response_body.metadata.id
    return { bin_id, response_body};
}