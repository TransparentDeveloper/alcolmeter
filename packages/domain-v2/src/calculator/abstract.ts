/**
 * 계산기 공통 추상 — 입력을 받아 결과를 계산한다.
 * 술 종류별 계산기(발효·증류·담금)가 이를 구현해 `calculate`를 강제한다.
 */
export abstract class Calculator<In, Out> {
	abstract calculate(input: In): Out;
}
