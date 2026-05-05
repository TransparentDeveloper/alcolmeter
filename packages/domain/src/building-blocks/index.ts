type Identity = string;

/** ID에 명목적 종류를 부여하는 brand 타입 유틸. 예: `type BrewRecipeId = Brand<'BrewRecipeId'>` */
type Brand<B extends string> = Identity & { readonly __brand: B };

abstract class AggregateRoot<Self extends AggregateRoot<Self, ID>, ID extends Identity> {
	abstract readonly id: ID;

	equals(other: Self): boolean {
		return other.id === this.id;
	}
}

abstract class Entity<ID extends Identity> {
	abstract readonly id: ID;

	equals(other: Entity<ID>): boolean {
		return other.id === this.id;
	}
}

abstract class ValueObject<Self> {
	abstract equals(other: Self): boolean;
}

/** 애그리거트 루트가 다른 애그리거트 루트를 참조할 때만 사용한다. 객체 직접 참조를 막아 애그리거트 경계를 보호하는 필드 타입. */
class Association<T extends AggregateRoot<T, ID>, ID extends Identity> {
	constructor(public readonly id: ID) {}
}

export { AggregateRoot, Association, Entity, ValueObject };
export type { Brand, Identity };
