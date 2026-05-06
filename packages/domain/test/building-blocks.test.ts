import { describe, expect, it } from 'vitest';
import { AggregateRoot, Association, Entity, ValueObject, type Identity } from '../src/building-blocks';

describe('AggregateRoot', () => {
	class TestAggregate extends AggregateRoot<TestAggregate, Identity> {
		constructor(public readonly id: Identity) {
			super();
		}
		equals(other: TestAggregate): boolean {
			return other instanceof TestAggregate && this.id === other.id;
		}
	}

	it('같은 id면 equals true', () => {
		expect(new TestAggregate('a' as Identity).equals(new TestAggregate('a' as Identity))).toBe(true);
	});

	it('다른 id면 equals false', () => {
		expect(new TestAggregate('a' as Identity).equals(new TestAggregate('b' as Identity))).toBe(false);
	});
});

describe('Entity', () => {
	class TestEntity extends Entity<Identity> {
		constructor(public readonly id: Identity) {
			super();
		}
		equals(other: Entity<Identity>): boolean {
			return other instanceof TestEntity && this.id === other.id;
		}
	}

	it('같은 id면 equals true', () => {
		expect(new TestEntity('x' as Identity).equals(new TestEntity('x' as Identity))).toBe(true);
	});

	it('다른 id면 equals false', () => {
		expect(new TestEntity('x' as Identity).equals(new TestEntity('y' as Identity))).toBe(false);
	});
});

describe('ValueObject', () => {
	class TestVO extends ValueObject<TestVO> {
		constructor(public readonly value: number) {
			super();
		}
		equals(other: TestVO): boolean {
			return other instanceof TestVO && this.value === other.value;
		}
	}

	it('같은 값이면 equals true', () => {
		expect(new TestVO(1).equals(new TestVO(1))).toBe(true);
	});

	it('다른 값이면 equals false', () => {
		expect(new TestVO(1).equals(new TestVO(2))).toBe(false);
	});
});

describe('Association', () => {
	class TestAggregate extends AggregateRoot<TestAggregate, Identity> {
		constructor(public readonly id: Identity) {
			super();
		}
		equals(other: TestAggregate): boolean {
			return other instanceof TestAggregate && this.id === other.id;
		}
	}

	it('id를 그대로 보유한다', () => {
		const ref = new Association<TestAggregate, Identity>('agg-1' as Identity);
		expect(ref.id).toBe('agg-1');
	});
});

describe('AggregateRoot instance check', () => {
	class A extends AggregateRoot<A, Identity> {
		constructor(public readonly id: Identity) { super(); }
		equals(other: A): boolean { return other instanceof A && this.id === other.id; }
	}
	class B extends AggregateRoot<B, Identity> {
		constructor(public readonly id: Identity) { super(); }
		equals(other: B): boolean { return other instanceof B && this.id === other.id; }
	}

	it('서로 다른 클래스는 같은 id여도 false (런타임 가드)', () => {
		const a = new A('x' as Identity);
		const b = new B('x' as Identity) as unknown as A;
		expect(a.equals(b)).toBe(false);
	});
});

describe('Entity instance check', () => {
	class X extends Entity<Identity> {
		constructor(public readonly id: Identity) { super(); }
		equals(other: Entity<Identity>): boolean { return other instanceof X && this.id === other.id; }
	}
	class Y extends Entity<Identity> {
		constructor(public readonly id: Identity) { super(); }
		equals(other: Entity<Identity>): boolean { return other instanceof Y && this.id === other.id; }
	}

	it('서로 다른 Entity 클래스는 같은 id여도 false', () => {
		const x = new X('a' as Identity);
		const y = new Y('a' as Identity);
		expect(x.equals(y)).toBe(false);
	});
});

describe('ValueObject instance check', () => {
	class P extends ValueObject<P> {
		constructor(public readonly v: number) { super(); }
		equals(other: P): boolean { return other instanceof P && this.v === other.v; }
	}
	class Q extends ValueObject<Q> {
		constructor(public readonly v: number) { super(); }
		equals(other: Q): boolean { return other instanceof Q && this.v === other.v; }
	}

	it('서로 다른 VO 클래스는 false', () => {
		const p = new P(1);
		const q = new Q(1) as unknown as P;
		expect(p.equals(q)).toBe(false);
	});
});
