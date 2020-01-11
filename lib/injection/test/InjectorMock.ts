import { Component } from '../src/component';
import { Autowired } from '../src/autowire';

@Component
export class Foo {
    getMock() {
        return 'works';
    }
}

@Component
export class Bar {
    @Autowired
    public foo: Foo;
}
