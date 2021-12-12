import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilArrayItemChanged, head, select } from './operators';

describe('select', () => {
  it('should work', () => {
    const data = {
      foo: 1,
    };

    const source = new BehaviorSubject(data);
    const spy = jest.fn();

    source
      .asObservable()
      .pipe(select((state) => state.foo))
      .subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);

    source.next({ foo: 1 });

    expect(spy).toHaveBeenCalledTimes(1);

    source.next({ foo: 2 });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(2);
  });
});

describe('distinctUntilArrayItemChanged', () => {
  it('should work', () => {
    const data: any[] = [];
    const source = new BehaviorSubject(data);

    const s$ = source.asObservable().pipe(distinctUntilArrayItemChanged());
    const spy = jest.fn();

    s$.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);

    // Same instance
    source.next(data);
    expect(spy).toHaveBeenCalledTimes(1);

    // Change length
    const item = { id: 1 };
    source.next([item]);
    expect(spy).toHaveBeenCalledTimes(2);

    // Different array ref with same item ref
    source.next([item]);
    expect(spy).toHaveBeenCalledTimes(2);

    // Update item
    source.next([{ id: 2 }]);
    expect(spy).toHaveBeenCalledTimes(3);

    // One more item
    source.next([{ id: 2 }, { id: 3 }]);
    expect(spy).toHaveBeenCalledTimes(4);
  });
});

describe('head', () => {
  it('should return the first item', () => {
    of([1])
      .pipe(head())
      .subscribe((v) => {
        expect(v).toBe(1);
      });
  });
});
