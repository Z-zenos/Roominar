import type {HttpLibrary, RequestContext} from './http';
import { ResponseContext} from './http';
import type { Observable } from '../rxjsStub';
import { from } from '../rxjsStub';

export class IsomorphicFetchHttpLibrary implements HttpLibrary {

    public send(request: RequestContext): Observable<ResponseContext> {
        const method = request.getHttpMethod().toString();
        const body = request.getBody();

        const resultPromise = fetch(request.getUrl(), {
            method: method,
            body: body as any,
            headers: request.getHeaders(),
            credentials: "include"
        }).then((resp: any) => {
            const headers: { [name: string]: string } = {};
            resp.headers.forEach((value: string, name: string) => {
              headers[name] = value;
            });

            const body = {
              text: () => resp.text(),
              binary: () => resp.blob()
            };
            return new ResponseContext(resp.status, headers, body);
        });

        return from<Promise<ResponseContext>>(resultPromise);

    }
}
