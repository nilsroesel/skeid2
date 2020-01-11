import 'jasmine';
import { applicationContext } from '../src/external';
import { Bar } from './InjectorMock';

describe('Test Dependency Injection', () => {

    it('Autowired field should be an instance', () => {
        applicationContext.load(Bar).then((bar) => {
            expect(bar.foo).toBeTruthy('Autowired Field is unset');
            expect(bar.foo.getMock()).toBe('works');
        });
    });
    
});
