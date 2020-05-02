export declare class Foo {
    getMock(): string;
    afterLoad(): void;
}
export declare let afterLoadSet: boolean;
export declare class Qualified extends Foo {
}
export declare class Bar {
    foo: Foo;
    foo2: any;
    qualified: Qualified;
}
