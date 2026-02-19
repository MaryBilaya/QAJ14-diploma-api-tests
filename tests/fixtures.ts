import { ControllerBin } from './controller';
import { test as base, APIRequestContext, expect as BaseExpect} from '@playwright/test';

type Fixtures = {
    jsonBin: ControllerBin;
};

export const test = base.extend<Fixtures>({
    jsonBin: async ({ request }, use) => {
        const jsonBin = new ControllerBin(request);
        await use(jsonBin);
    },
});

export const expect = BaseExpect;