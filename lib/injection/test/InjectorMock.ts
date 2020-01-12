import { Component } from '../src/component';
import { Autowired } from '../src/autowire';

@Component
export class Foo {
    getMock() {
        return 'works';
    }
}

@Component('manual')
export class Qualified extends Foo {}

@Component
export class Bar {
    @Autowired
    public foo: Foo;

    @Autowired(Foo)
    public foo2: any;

    @Autowired('manual')
    public qualified: Qualified;
}
