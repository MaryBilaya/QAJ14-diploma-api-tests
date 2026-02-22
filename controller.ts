import { APIRequestContext, APIResponse, expect } from "playwright/test";

export class ControllerBin {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    //создание bin 
    async createBin(data: unknown, options?: {
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

                console.log('Create STATUS', response.status());
                console.log('Create BODY', await response.text());

                const response_body = await response.json();
                return { response, response_body }
            }

    //чтение bin
    async readBin(binId: string, options?: {binVersion?: string; meta?: boolean})
    : Promise<{ response: APIResponse; response_body: any}> { 
        const headers: Record<string, string> = {
            'X-Master-Key': process.env.X_Master_Key as string,
        };

        let url = `/v3/b/${binId}`;
        if (options?.binVersion) {
            url = `/v3/b/${binId}/${options.binVersion}`;
        }

        let response;

        //получить данные без метаданных
        if (options?.meta === false) {
            response = await this.request.get(url, { 
                headers,
                params: { meta: 'false'},
            });
        } else {
            response = await this.request.get(url, {
                headers,
            });
        }

        console.log('Read STATUS', response.status());
        console.log('Read BODY', await response.text());

        const response_body = await response.json();
        return { response, response_body }
    };

    //редактирование bin
    async updateBin(binId: string, data: unknown, options?: {binVersioning?: boolean})                     //binVersioning = false by default
    : Promise<{ response: APIResponse; response_body: any}> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',                                 
            'X-Master-Key': process.env.X_Master_Key as string,
        };

        if (options?.binVersioning !== undefined) {
            headers['X-Bin-Versioning'] = String(options.binVersioning);
        }

        const response = await this.request.put(`/v3/b/${binId}`, {
            headers,
            data,
        });

        console.log('Update STATUS', response.status());
        console.log('Update BODY', await response.text());

        const response_body = await response.json();
        return { response, response_body };
    }

    //удаление bin
    async deleteBin(binId: string) {
        const response = await this.request.delete(`v3/b/${binId}`, {
            headers: {
               'X-Master-Key': process.env.X_Master_Key as string, 
            }
        });

        console.log('Delete STATUS', response.status());
        console.log('Delete BODY', await response.text());

        const response_body = await response.json().catch(() => ({})); 
        return { response, response_body };  
    }
}