import * as Hapi from "hapi";
import Joi = require("joi");

const server = new Hapi.Server({
    port: 3000,
    host: "localhost",
    routes: {
        validate: {
            async failAction(request: Hapi.Request, h: Hapi.ResponseToolkit, error?: Error) {
                throw error;
            }
        }
    }
});

const requestPayloadSchema = {
    firstName: Joi.ref("name.firstName"),
    name: Joi.object({
        firstName: Joi.string(),
    })
};

interface INamePayload {
    firstName?: string;
    name?: {
        firstName: string;
    }
}

const responseSchema = { response: Joi.string().required() };

const routes: Hapi.ServerRoute[] = [
    {
        path: "/",
        method: "POST",
        async handler(req: Hapi.Request, h: Hapi.ResponseToolkit) {
            const payload = req.payload as INamePayload;
            
            if (payload.firstName) {
                return { response: `Hello, ${payload.firstName}!` };
            } else if (payload.name) {
                return { response: `Hello, ${payload.name.firstName}` };
            } else {
                return { response: `Hello! I didn't catch your name, can you repeat that?` };
            }
        },
        options: {
            validate: {
                payload: requestPayloadSchema
            },
            response: {
                schema: responseSchema
            }
        }
    }
];

async function bootstrap() {
    server.route(routes);

    await server.start();

    console.log(`Server running at: ${server.info.uri}\n`);
}

bootstrap()
    .catch(console.error);