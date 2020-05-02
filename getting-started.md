# Getting started with skeid2

## Project Init
Make sure you have a recent version of node and npm installed.  
Everything is tested and developed with node v12.  
*The server uses node 10 features, but they will be removed in future and this will break any usage in node versions below 12/13*

### Create the project
Do the npm project init  
`$ npm init`

Install and configure typescript  
`$ npm i typescript --save-dev`  

Create the tsconfig.json (You can use this as example)
```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["esnext", "dom"],
    "module": "commonjs",
    "moduleResolution": "node",
    "noImplicitThis": false,
    "strictPropertyInitialization": false,
    "strict": true,
    "jsx": "react",
    "allowJs": true,
    "sourceMap": true,
    "inlineSources": true,
    "types": ["node"],
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./target"
  }
}
```

Install skeid2 from git
`$ npm install nilsroesel/skeid2#publishing-draft --save`

## Coding

Creating an application  
The application decorator can be configured with the port and  
some event emitters, that need to emit the ready event to start the application  
(e.g. for database connections, etc)
```typescript
import { Application } from 'skeid2';

@Application({ port: 80 })
class App {
}
```

Dependency Injection  
A class decorated with component will be created as singleton
by the DI-container. You can use the dependency via @Autowired
in every other component.  

```typescript
import { Component, Autowired } from 'skeid2';

@Component
class Service {
    foo(): string { return 'Hello world'; }
}

@Component
class OtherService {
    @Autowired
    private service: Service;
    
    helloWorld(): string {
        return this.service.foo();
    }
}
```

If you encounter circular dependencies, the typescript module loader will break.
You should avoid circular dependencies anyways, but if you want to, you can provide a qualifier.

```typescript
import { Component, Autowired } from 'skeid2';

@Component('service')
class Service {
    @Autowired('otherService')
    private otherService: OtherService;

    foo(): string { return 'Hello world'; }
}

@Component('otherService')
class OtherService {
    @Autowired('service')
    private service: Service;
    
    helloWorld(): string {
        return this.service.foo();
    }
}
```

## Rest Control
Each component will be also registered in the IoC-Rest Container
You can annotate request mappings to methods there.  
(The example shows Get and Post mappings, but there are also the common rest methods available)

```typescript
@Component
class Controller {
    @Autowired
    private service: Service;
    
    @Get('/hello-world')
    helloWorld(): string {
        return this.service.foo();
    }
}
```

With @Produces you can easily define the successful response
```typescript
@Component
class Controller {
    @Autowired
    private service: Service;
    
    @Get('/hello-world')
    @Produces(200, 'application/json')
    helloWorld(): string {
        return {
            text: this.service.foo();
        } 
    }
}
```

@Deserialize can be applied on classes, to define, how they should be deserialized to a response.
The deserializer function would take an instance from the decorated class and returns a string.
You can also define the mimetype
If the method also provides a mime type its resolved in the following order
Class Mimetype, Method Mime Type
```typescript
@Deserialize<Version>(v => JSON.stringify({ version: v.versionNumber }), 'application/json')
class Version {
    constructor(public readonly versionNumber: string) {}
}
```

Accessing parameters
```typescript
@Component
class Controller {
    @Autowired
    private service: Service;
    
// {id} would generate the pathvariable id, if you name you function parameter like the variable  
// it would try to automatically resolve the name
// you could asi qualify it by your own
    @Get('/hello-world/{id}')
    @Produces(200, 'application/json')
    helloWorld( @PathVariable id: number, @PathVariable('id') id: number): string {
        return {
            text: this.service.foo();
        } 
    }
}
```
Typing parameters  
As on schemas (described below) you can call a serializer function to serialize 
your parameters

```typescript
@Component
class Controller {
    @Autowired
    private service: Service;
    

    @Get('/hello-world/{id}')
    @Produces(200, 'application/json')
    helloWorld( @PathVariable(Number) id: number): string {
        return {
            text: this.service.foo();
        } 
    }
}
```
For url parameters you can use @QueryParameter that works as the @PathVariable  
Or you can create an object with all query parameters and validate them with a rest schema (also described below)
`@QueryParameters(SomeSchema) parameters`


With @Consumes you can define the mime type for the request body (eg for post requests)
@Component
With @RequestBody you can get access to the posted body
```typescript
class Controller {
    @Autowired
    private service: Service;
    
    @Post('/echo')
    @Consumes('application/json')
    @Produces(201, 'application/json')
    echo( @RequestBody body ): string {
        return body;
    }
}
```

You can also add a schema to the body, to validate it. If the request body does not fit to the schema, it would create a bad request  
The rest schema takes an object of the definition, and for each property a serializer function, that could  
serialize a json value, or an other Schema definition.  
You can also use the javascript object constructors like String, Number, Date
or create your own functions to also do custom validation there
```typescript
interface Echo {
    echo: string;
}
const EchoSchema = new RestSchema<Echo>({ echo: String });



class Controller {
    @Autowired
    private service: Service;
    
    @Post('/echo')
    @Consumes('application/json')
    @Produces(201, 'application/json')
    echo( @RequestBody(EchoSchema) body: Echo ): Echo {
        return body;
    }
}
```
By default it would take a schema wildcard.  
You could also use the string schema, to get the body as string
`RestSchema.string()`

If you have intersection types you could also create intersections from schemas
```typescript
import { RestSchema } from './rest-schema'; 
interface Echo {
    echo: string;
}
interface HelloWorld {
    helloWorld: any;
}
const EchoSchema = new RestSchema<Echo>({ echo: String });
const HwSchema = new RestSchema.any();
const UnionSchema = EchoSchema.intersection(HwSchema);

// this would be equivalent to
new RestSchema<Echo & HelloWorld>({
    echo: String,
    helloWorld: RestSchema.any()
})
```

## Error Handling
You can decorate errors also with @Deserializer and @Produces and map them to http statuses

```typescript
@Produces(501)
@Deserialize(JSON.stringify, 'application/json')
class NotImplementedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

// Third Party error decorating
Deserialize<Error>(err => err.stack || (err as any).toString())(Error);
Produces(500, 'text/plain')(Error);
```


## Example Application
```typescript
import { 
    Component, 
    Application,
    Consumes,
    Deserialize,
    Get, PathVariable,
    Post,
    Produces, QueryParameters,
    RequestBody,
    ResponseEntity,
    RestSchema, TextResponse, ApiError 
} from 'skeid2';

interface Echo {
    echo: string;
}
const EchoSchema = new RestSchema<Echo>({ echo: String });
RestSchema.any()
@Produces(501)
@Deserialize(JSON.stringify, 'text/plain')
class NotImplementedError extends ApiError {
    constructor(message: string) {
        super(501, message);
    }
}

// Third Party error decorating
Deserialize<Error>(err => err.stack || (err as any).toString())(Error);
Produces(500, 'text/plain')(Error);

Deserialize<ApiError>(JSON.stringify, 'application/json')(ApiError)
Produces<ApiError>(err => err.code)(ApiError)


@Deserialize<Version>(v => JSON.stringify({ version: v.versionNumber }), 'application/json')
class Version {
    constructor(public readonly versionNumber: string) {}
}

@Deserialize<HtmlVersion>(v => v.template, 'text/html')
class HtmlVersion extends Version {
    public template = `<html lang="EN"><body><h2>Version: ${ this.versionNumber }</h2></body></html>`
}

@Component
@Application({ port: 80 })
class Api {

    @Get('/error')
    public raiseError() {
        const random = Math.random();
        if ( random >= 0.5 )
            throw new ApiError(503, 'An expected unåexpected condition occurred');
        throw new NotImplementedError('This endpoint is not implemented.');
    }

    @Get('/static')
    @Produces<Version | HtmlVersion>(v => v instanceof HtmlVersion ? 201: 200)
    public staticServe(): Version | HtmlVersion {
        const random = Math.random();
        if ( random >= 0.5 ) return new HtmlVersion('api-v0:html');
        return new Version('api-v0:json');
    }

    @Post('/echo')
    @Consumes('application/json')
    @Produces(200, 'application/json')
    public echoStrictJsonBody( @RequestBody(EchoSchema) echoBody: Echo ) {
        return echoBody;
    }

    @Post('/echo')
    @Consumes('text/plain')
    @Produces(200, 'text/plain')
    public echoStringBody( @RequestBody(RestSchema.string()) echoBody: string ) {
        return echoBody;
    }

    @Post('/echo')
    public echoSomething(
        @RequestBody(RestSchema.string()) echoBody: any,
        @ResponseEntity(f => f.TextResponseEntity) response: TextResponse
    ) {
        response.status(200, 'Echo Ok');
        response.setHeader('Content-Type', 'text/plain');
        response.body(echoBody);
        response.respond();
    }
}

```


