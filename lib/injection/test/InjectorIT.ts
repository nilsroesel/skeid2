import 'jasmine';
import { applicationContext } from '../src/external';
import { Bar } from './InjectorMock';

describe('Test Dependency Injection', () => {

    it('Autowired fields should be an instance', () => {
        applicationContext.load(Bar).then((bar) => {
            expect(bar.foo).toBeDefined('Autowired Field is unset');
            expect(bar.foo2).toBeDefined('Class Qualified Autowired Field is unset');
            expect(bar.qualified).toBeDefined('String Qualified Autowired field is unset');
            expect(bar.foo.getMock()).toBe('works');
            expect(bar.foo2.getMock()).toBe('works');
            expect(bar.qualified.getMock()).toBe('works');
        });
    });
    
});
