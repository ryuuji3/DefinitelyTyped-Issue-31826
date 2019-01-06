import * as Hapi from "hapi";
import * as Joi from "joi";

const server = new Hapi.Server({
    port: 3000,
    host: "localhost"
});

const requestPayloadSchema = Joi.object().keys({
    firstName: Joi.ref("name.firstName"),
    name: {
        firstName: Joi.string().required(),
    }
});

interface INamePayload {
    firstName?: string;
    name?: {
        firstName: string;
    }
}

const responseSchema = Joi.string().required();

const routes: Hapi.ServerRoute[] = [
    {
        path: "/",
        method: "POST",
        async handler(req: Hapi.Request, h: Hapi.ResponseToolkit) {
            const payload = req.payload as INamePayload;
            
            if (payload.firstName) {
                return `Hello, ${payload.firstName}!`
            } else if (payload.name) {
                return `Hello, ${payload.name.firstName}`
            } else {
                return `Hello! I didn't catch your name, can you repeat that?`
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