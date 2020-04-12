import 'jasmine';

import { ArraySerializer, DateSerializer, InvalidSchemaError, RestSchema } from '../src/schema/';
import { Address, User, UserList, UserWithAddress } from './helpers';

describe('RestSchema', () => {
    it('Should serialize a valid object from a schema', () => {
        const UserSchema = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: DateSerializer
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
        const UserSchema = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: DateSerializer
        });
        const UserListSchema = new RestSchema<UserList>( {
            users: ArraySerializer(UserSchema)
        });

        const users: Array<any> = [
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
        const UserSchema = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: DateSerializer
        });
        const UserListSchema = new RestSchema<UserList>( {
            users: ArraySerializer(UserSchema)
        });

        const users: Array<any> = [];

        const created = UserListSchema.serialize({ users });
        expect(created.users).toEqual([]);
    });

    it('Should fail to serialize an array with wrong items', () => {
        const UserSchema = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: DateSerializer
        });
        const UserListSchema = new RestSchema<UserList>( {
            users: ArraySerializer(UserSchema)
        });

        const users: Array<any> = [{ notAnUserProperty: '' }];
        expect(() => {
            UserListSchema.serialize({ users });
        }).toThrowMatching(thrown => thrown instanceof InvalidSchemaError);
    });

    it('Should serialize with nested schema', () => {
        const AddressSchema = new RestSchema<Address>({
            street: String,
            zipCode: String
        });
        const UserWithAddressSchema = new RestSchema<UserWithAddress>( {
            id: Number,
            name: String,
            createdDate: DateSerializer,
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
        const defaultDate: Date = new Date();
        const UserSchema: RestSchema<User> = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: {
                serializer: DateSerializer,
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
        const defaultDate: Date = new Date();
        const UserSchema: RestSchema<User> = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: {
                serializer: DateSerializer,
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
        const UserSchema: RestSchema<User> = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: {
                serializer: DateSerializer,
                required: true
            }
        });

        expect(() => {
           UserSchema.serialize({
               id: 1,
               name: 'Waldo',
           });
        }).toThrowMatching(thrown => thrown instanceof InvalidSchemaError);
    });

    it('Should fail on a strict schema', () => {
        const UserSchema: RestSchema<User> = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: DateSerializer
        });

        expect(() => {
            UserSchema.serialize({
                id: 1,
                name: 'Waldo',
                createdDate: '01-01-1999',
                somethingElse: undefined
            });
        }).toThrowMatching(thrown => thrown instanceof InvalidSchemaError);
    });

    it('Should not fail on a lenient schema', () => {
        const UserSchema: RestSchema<User> = new RestSchema<User>( {
            id: Number,
            name: String,
            createdDate: DateSerializer
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
        const AnySchema: RestSchema<any>= RestSchema.any();
        const data: any = {
            something: null,
            somethingElse: 'Hello World'
        };
        const created: any = AnySchema.serialize(data);
        expect(created).toEqual(data);
    });
});
