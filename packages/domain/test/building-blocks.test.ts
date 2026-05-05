import { describe, expect, it } from 'vitest';
import { AggregateRoot, Association, Entity, ValueObject, type Identity } from '../src/building-blocks';

describe('AggregateRoot', () => {
	class TestAggregate extends AggregateRoot<TestAggregate, Identity> {
		constructor(public readonly id: Identity) {
			super();
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
			return this.value === other.value;
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
	}

	it('id를 그대로 보유한다', () => {
		const ref = new Association<TestAggregate, Identity>('agg-1' as Identity);
		expect(ref.id).toBe('agg-1');
	});
});
