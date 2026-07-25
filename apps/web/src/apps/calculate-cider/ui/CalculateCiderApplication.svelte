<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { CalculateCiderPage } from '$pages/calculate-cider/ui';
</script>

<MetaHead
	title="사이다 계산기 - 알콜미터"
	description="하드 사이다(사과술) 도수 계산기. 사과 양과 품종을 넣으면 예상 도수와 생산량을 계산합니다. 가당 시 발효 정지 경고도 알려드립니다."
	path="/calculate-cider"
	image="/og/calculate-cider.png"
/>

<CalculateCiderPage />
