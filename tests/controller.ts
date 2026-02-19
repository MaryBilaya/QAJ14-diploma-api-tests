import { APIRequestContext, APIResponse, expect } from "playwright/test";

export class ControllerBin {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    //создание bin (требуются: тело + ключи в заголовках)
    async createBin(
        data: unknown, 
        options?: {
            x_bin_name?: string,                                                        //1-128 characters
            x_bin_private?: boolean;                                                    //By default, the record is created as a private record
        }): Promise<{ response: APIResponse; response_body: any}> {
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',                                 //required. Without: "Error Message"
                    'X-Master-Key': process.env.X_Master_Key as string,                 //required   
                };
                if (options?.x_bin_private !== undefined) {
                    headers['X-Bin-Private'] = String(options.x_bin_private);
                }
                if (options?.x_bin_name) {
                    headers['X-Bin-Name'] = options.x_bin_name;
                }
                const response = await this.request.post('/v3/b', {
                    headers,
                    data,                                                               //без json -> "Bin cannot be blank"
                });

                console.log('STATUS', response.status());
                console.log('BODY', await response.text());

                const response_body = await response.json();
                return { response, response_body }
            }

    async updateBin(BIN_ID: string, data: unknown) {
        const response = await this.request.put(`/b/${BIN_ID}`, {
            data,
        });
        const response_body = await response.json();
        return { response, response_body };
    }

    async deleteBin(BIN_ID: string) {
        const response = await this.request.delete(`/b/${BIN_ID}`);
        const response_body = await response.json().catch(() => ({})); 
        return { response, response_body };  
    }

    async collectionBins(collectionId: string) {
        const response = await this.request.get(`/c/${collectionId}`);
        const response_body = await response.json();
        return { response, response_body };
    }
}