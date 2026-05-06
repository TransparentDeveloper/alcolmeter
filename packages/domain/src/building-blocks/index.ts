type Identity<B extends string = string> = string & { readonly __brand: B };

abstract class AggregateRoot<Self extends AggregateRoot<Self, ID>, ID extends Identity> {
	abstract readonly id: ID;

	abstract equals(other: Self): boolean;
}

abstract class Entity<ID extends Identity> {
	abstract readonly id: ID;

	abstract equals(other: Entity<ID>): boolean;
}

abstract class ValueObject<Self> {
	abstract equals(other: Self): boolean;
}

/** 애그리거트 루트가 다른 애그리거트 루트를 참조할 때만 사용한다. 객체 직접 참조를 막아 애그리거트 경계를 보호하는 필드 타입. */
class Association<T extends AggregateRoot<T, ID>, ID extends Identity> {
	constructor(public readonly id: ID) {}
}

export { AggregateRoot, Association, Entity, ValueObject };
export type { Identity };
