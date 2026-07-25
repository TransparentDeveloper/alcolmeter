<script lang="ts">
	import { MetaHead } from '$shared/ui';
	import { CalculateMakgeolliPage } from '$pages/calculate-makgeolli/ui';
</script>

<MetaHead
	title="막걸리 계산기 - 알콜미터"
	description="막걸리 양조 배합 계산기. 쌀 총량과 형태를 입력하면 단양주, 이양주, 삼양주별 쌀·물·누룩 비율을 자동 계산합니다."
	path="/calculate-makgeolli"
	image="/og/calculate-makgeolli.png"
/>

<CalculateMakgeolliPage />
