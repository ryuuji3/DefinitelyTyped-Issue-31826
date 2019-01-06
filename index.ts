import * as Hapi from "hapi";

const server = new Hapi.Server({
    port: 3000,
    host: "localhost"
});



const routes: Hapi.ServerRoute[] = [
    {
        path: "/",
        method: "GET",
        async handler(req: Hapi.Request, h: Hapi.ResponseToolkit) {
            return "ok";
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