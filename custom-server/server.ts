import 'dotenv/config';
import express, { Request, Response, RequestHandler } from 'express';
import { parse } from 'url';
import next from 'next';
import bodyParser from 'body-parser';
import snowflakeHandler from '../src/server/snowflake';


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  const snowflakeMiddleware: RequestHandler = async (req, res) => {
    await snowflakeHandler(req, res);
  };

  server.use('/api/snowflake', snowflakeMiddleware);

  server.all('*', (req: Request, res: Response) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.listen(3001, () => {
    console.log(`> Custom server ready on http://localhost:3001`);
  });
});
