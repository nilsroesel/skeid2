"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const schema_1 = require("../src/schema/");
describe('RestSchema', () => {
    it('Should serialize a valid object from a schema', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        });
        const created = UserSchema.serialize({
            id: 1,
            name: 'Waldo',
            createdDate: '01-01-1999'
        });
        expect(created.id).toEqual(1);
        expect(created.name).toEqual('Waldo');
        expect(created.createdDate).toEqual(new Date('01-01-1999'));
    });
    it('Should serialize an array', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        });
        const UserListSchema = new schema_1.RestSchema({
            users: schema_1.ArraySerializer(UserSchema)
        });
        const users = [
            {
                id: 1,
                name: 'Waldo',
                createdDate: '01-01-1999'
            },
            {
                id: 2,
                name: 'Walter',
                createdDate: '01-01-2000'
            }
        ];
        const created = UserListSchema.serialize({ users });
        expect(created.users[0].id).toEqual(1);
        expect(created.users[1].id).toEqual(2);
        expect(created.users[0].name).toEqual('Waldo');
        expect(created.users[1].name).toEqual('Walter');
        expect(created.users[0].createdDate).toEqual(new Date('01-01-1999'));
        expect(created.users[1].createdDate).toEqual(new Date('01-01-2000'));
    });
    it('Should serialize an empty array', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        });
        const UserListSchema = new schema_1.RestSchema({
            users: schema_1.ArraySerializer(UserSchema)
        });
        const users = [];
        const created = UserListSchema.serialize({ users });
        expect(created.users).toEqual([]);
    });
    it('Should fail to serialize an array with wrong items', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        });
        const UserListSchema = new schema_1.RestSchema({
            users: schema_1.ArraySerializer(UserSchema)
        });
        const users = [{ notAnUserProperty: '' }];
        expect(() => {
            UserListSchema.serialize({ users });
        }).toThrowMatching(thrown => thrown instanceof schema_1.InvalidSchemaError);
    });
    it('Should serialize with nested schema', () => {
        const AddressSchema = new schema_1.RestSchema({
            street: String,
            zipCode: String
        });
        const UserWithAddressSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer,
            address: AddressSchema
        });
        const created = UserWithAddressSchema.serialize({
            id: 1,
            name: 'Waldo',
            createdDate: '01-01-1999',
            address: {
                street: 'Foo Street',
                zipCode: '00000'
            }
        });
        expect(created.id).toEqual(1);
        expect(created.name).toEqual('Waldo');
        expect(created.address.street).toEqual('Foo Street');
        expect(created.address.zipCode).toEqual('00000');
    });
    it('Should serialize a valid object from a schema with optional parameters', () => {
        const defaultDate = new Date();
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: {
                serializer: schema_1.DateSerializer,
                required: false,
                defaultValue: defaultDate
            }
        });
        const createdUser = UserSchema.serialize({
            id: 1,
            name: 'Waldo'
        });
        expect(createdUser.createdDate).toEqual(defaultDate);
    });
    it('Should prefer a present value over a default value', () => {
        const defaultDate = new Date();
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: {
                serializer: schema_1.DateSerializer,
                required: false,
                defaultValue: defaultDate
            }
        });
        const createdUser = UserSchema.serialize({
            id: 1,
            name: 'Waldo',
            createdDate: '01-01-1999'
        });
        expect(createdUser.createdDate).toEqual(new Date('01-01-1999'));
    });
    it('Should fail to serialize an invalid object from a schema', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: {
                serializer: schema_1.DateSerializer,
                required: true
            }
        });
        expect(() => {
            UserSchema.serialize({
                id: 1,
                name: 'Waldo',
            });
        }).toThrowMatching(thrown => thrown instanceof schema_1.InvalidSchemaError);
    });
    it('Should fail on a strict schema', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        });
        expect(() => {
            UserSchema.serialize({
                id: 1,
                name: 'Waldo',
                createdDate: '01-01-1999',
                somethingElse: undefined
            });
        }).toThrowMatching(thrown => thrown instanceof schema_1.InvalidSchemaError);
    });
    it('Should not fail on a lenient schema', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        }, false);
        const created = UserSchema.serialize({
            id: 1,
            name: 'Waldo',
            createdDate: '01-01-1999',
            somethingElse: undefined
        });
        expect(created.id).toEqual(1);
        expect(created.name).toEqual('Waldo');
        expect(created.createdDate).toEqual(new Date('01-01-1999'));
    });
    it('Should serialize anything for the any schema', () => {
        const AnySchema = schema_1.RestSchema.any();
        const data = {
            something: null,
            somethingElse: 'Hello World'
        };
        const created = AnySchema.serialize(data);
        expect(created).toEqual(data);
    });
    it('Should serialize an intersection schema', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        });
        const UserListSchema = new schema_1.RestSchema({
            users: schema_1.ArraySerializer(UserSchema)
        });
        const UserAndUserListSchema = UserListSchema.intersection(UserSchema);
        const user = { id: 1, name: 'Waldo', createdDate: '01-01-1999' };
        const createdUser = { id: 1, name: 'Waldo', createdDate: new Date('01-01-1999') };
        const created = UserAndUserListSchema.serialize({
            id: 1,
            name: 'Waldo',
            createdDate: '01-01-1999',
            users: [user, user]
        });
        expect(created).toEqual(Object.assign(Object.assign({}, createdUser), { users: [createdUser, createdUser] }));
    });
    it('Should fail to serialize an intersection schema', () => {
        const UserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        });
        const UserListSchema = new schema_1.RestSchema({
            users: schema_1.ArraySerializer(UserSchema)
        });
        expect(() => {
            const UserAndUserListSchema = UserListSchema.intersection(UserSchema);
            UserAndUserListSchema.serialize({ id: 1, name: 'Waldo', createdDate: '01-01-1999' });
        }).toThrowMatching(thrown => thrown instanceof schema_1.InvalidSchemaError);
    });
    it('Should serialize an partial schema', () => {
        const PartialUserSchema = new schema_1.RestSchema({
            id: Number,
            name: String,
            createdDate: schema_1.DateSerializer
        }).asPartialType();
        const created1 = PartialUserSchema.serialize({ id: 1 });
        expect(created1.id).toEqual(1);
        expect(created1.name).not.toBeDefined();
        expect(created1.createdDate).not.toBeDefined();
    });
});
//# sourceMappingURL=SchemaIT.js.map