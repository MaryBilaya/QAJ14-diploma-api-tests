import { APIRequestContext, expect } from "playwright/test";

export async function updateTestBin(request: APIRequestContext, binId: string, data: any) {
    const response = await request.put(`/v3/b/${binId}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': process.env.X_Master_Key as string,
        }, 
        data,       
    });
    return response;
}