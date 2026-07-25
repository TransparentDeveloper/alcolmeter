<script lang="ts">
	import type { PrivacySectionIdType } from '$entities/privacy/model';
	import { sections } from '$entities/privacy/lib';
</script>

{#each sections as s, i (s.id)}
	<section id={s.id} class="policy-section">
		<div class="section-header">
			<span class="section-number">{String(i + 1).padStart(2, '0')}</span>
			<h2>{s.title}</h2>
		</div>
		<div class="section-body">
			{@render body(s.id)}
		</div>
	</section>
{/each}

{#snippet body(id: PrivacySectionIdType)}
	{#if id === 'overview'}
		<p>
			알콜미터는 이용자의 개인정보를 소중히 여기며 「개인정보 보호법」 등 관계 법령을 준수합니다. 이
			방침은 알콜미터(웹과 Chrome 확장 프로그램)가 어떤 개인정보를 어떤 목적으로 처리하고 얼마나
			보관하며, 이용자가 어떤 권리를 행사할 수 있는지 안내합니다.
		</p>
		<p>
			막걸리 계산기 등 계산 기능은 이용자의 브라우저 안에서만 동작하며 입력값을 서버로 보내거나
			저장하지 않습니다. 개인정보는 로그인, 알콜위키·커뮤니티 참여처럼 계정이 필요한 기능에서만
			처리됩니다.
		</p>
	{:else if id === 'items'}
		<p>알콜미터는 다음의 개인정보를 수집합니다.</p>
		<ul>
			<li>
				<strong>소셜 로그인(Google)</strong>: 이메일 주소, 이름, 프로필 사진. Google 계정으로
				로그인할 때 Google에서 제공받습니다.
			</li>
			<li>
				<strong>서비스 이용 중 생성되는 정보</strong>: 알콜위키·커뮤니티에 작성한 문서와 게시글, 편집
				이력, 작성자 식별자, 화면에 표시되는 이름.
			</li>
			<li>
				<strong>자동으로 수집되는 정보</strong>: 접속 로그, 기기·브라우저 정보, IP 주소에 기반한
				대략적인 접속 지역, 페이지 조회 기록. Google Analytics를 통해 수집됩니다.
			</li>
		</ul>
		<p>주민등록번호 등 고유식별정보나 결제 정보는 수집하지 않습니다.</p>
	{:else if id === 'purpose'}
		<p>수집한 개인정보는 다음 목적으로만 이용합니다.</p>
		<ul>
			<li>로그인과 이용자 식별, 계정 유지</li>
			<li>알콜위키·커뮤니티 글의 작성자 표시와 편집 이력 관리</li>
			<li>서비스 운영·개선과 오류 대응</li>
			<li>접속 통계 분석을 통한 서비스 품질 향상</li>
		</ul>
		<p>이용 목적이 바뀌면 관계 법령에 따라 별도로 동의를 받습니다.</p>
	{:else if id === 'processors'}
		<p>
			알콜미터는 서비스 제공을 위해 아래 사업자에 개인정보 처리를 위탁하고 있습니다. 이들의 인프라가
			국외에 있어 개인정보가 국외로 이전됩니다.
		</p>
		<div class="table-scroll">
			<table class="processors">
				<thead>
					<tr>
						<th scope="col">위탁받는 자</th>
						<th scope="col">위탁 업무</th>
						<th scope="col">이전 항목</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Supabase Inc. (미국)</td>
						<td>계정 인증, 데이터베이스 저장</td>
						<td>로그인 정보, 작성 콘텐츠, 접속 정보</td>
					</tr>
					<tr>
						<td>Vercel Inc. (미국)</td>
						<td>웹 호스팅, 서버 접속 로그</td>
						<td>접속 로그, IP 주소</td>
					</tr>
					<tr>
						<td>Google LLC (미국)</td>
						<td>소셜 로그인, 이용 통계 분석</td>
						<td>로그인 정보, 자동 수집 정보</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p>
			이전 국가는 미국이며, 이전 방법과 시점은 서비스 이용 시 네트워크를 통한 전송입니다. 관계 법령이
			정한 경우를 제외하고 개인정보를 마케팅 등 다른 목적으로 제3자에게 제공하지 않습니다.
		</p>
	{:else if id === 'retention'}
		<ul>
			<li>
				<strong>회원 정보와 작성 콘텐츠</strong>: 회원 탈퇴 또는 이용자의 삭제 요청 시까지 보유하며,
				목적이 달성되면 지체 없이 파기합니다.
			</li>
			<li>
				<strong>자동으로 수집되는 접속 정보</strong>: 통신비밀보호법 등 관계 법령과 위탁사(Google 등)의
				보존 정책에 따라 일정 기간 보관한 뒤 파기합니다.
			</li>
		</ul>
		<p>전자적 파일 형태의 정보는 복구·재생할 수 없는 방법으로 삭제합니다.</p>
	{:else if id === 'rights'}
		<p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
		<ul>
			<li>개인정보 열람 요청</li>
			<li>오류에 대한 정정 요청</li>
			<li>삭제 및 처리정지 요청</li>
		</ul>
		<p>
			현재 앱 안의 계정 삭제(회원 탈퇴) 기능은 준비 중이며, 그전까지는 아래 문의처로 요청하시면 관계
			법령이 정한 기간 안에 처리해 드립니다. 다만 알콜위키처럼 여러 이용자가 함께 작성·수정하는
			콘텐츠는 편집 이력의 성격상 일부가 남을 수 있으며, 이 경우 작성자를 식별할 수 없도록 처리합니다.
		</p>
	{:else if id === 'cookies'}
		<p>
			알콜미터는 이용 통계 분석을 위해 Google Analytics를 사용하며, 이 과정에서 쿠키가 저장될 수
			있습니다. 이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있고, 이 경우 통계 수집이
			제한됩니다.
		</p>
		<p>
			또한 로그인 상태 유지와 화면 테마 등 환경 설정을 위해 브라우저의 로컬 저장소를 사용합니다. 이
			정보는 이용자 기기에만 저장되며 서버로 전송되지 않습니다.
		</p>
	{:else if id === 'contact'}
		<p>개인정보 처리에 관한 문의와 요청은 아래 이메일로 연락해 주세요.</p>
		<img src="/email-contact.png" alt="문의 이메일 주소" class="email-img" />
		<p class="revision">
			이 방침은 법령이나 서비스 변경에 따라 개정될 수 있으며, 개정 시 이 페이지에 공지합니다.
		</p>
	{/if}
{/snippet}

<style>
	.policy-section {
		scroll-margin-top: var(--ds-space-xl);
	}

	.policy-section + .policy-section {
		margin-top: var(--ds-space-2xl);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--ds-space-sm);
		margin-bottom: var(--ds-space-md);
	}

	.section-number {
		font-family: var(--ds-font-mono);
		font-size: var(--ds-text-xs);
		font-variant-numeric: tabular-nums;
		color: var(--ds-color-ink-3);
		background: var(--ds-color-surface);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		padding: var(--ds-space-2xs) var(--ds-space-sm);
		border-radius: var(--ds-radius-sm);
		flex-shrink: 0;
	}

	.section-header h2 {
		font-family: var(--ds-font-display);
		font-size: var(--ds-text-lg);
		font-weight: var(--ds-weight-bold);
		letter-spacing: var(--ds-tracking-tight);
		color: var(--ds-color-ink-1);
	}

	.section-body {
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-md);
		font-size: var(--ds-text-sm);
		line-height: 1.8;
		color: var(--ds-color-ink-2);
	}

	.section-body :global(p) {
		margin: 0;
	}

	.section-body :global(strong) {
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-1);
	}

	.section-body :global(ul) {
		margin: 0;
		padding-left: var(--ds-space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--ds-space-sm);
	}

	.section-body :global(li) {
		padding-left: var(--ds-space-2xs);
	}

	.section-body :global(li::marker) {
		color: var(--ds-color-ink-4);
	}

	/* 위탁·국외 이전 표 */
	.table-scroll {
		overflow-x: auto;
	}

	.processors {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--ds-text-xs);
		border: var(--ds-border-width) solid var(--ds-color-border-2);
		border-radius: var(--ds-radius-md);
		overflow: hidden;
	}

	.processors th,
	.processors td {
		text-align: left;
		padding: var(--ds-space-sm) var(--ds-space-md);
		border-bottom: var(--ds-border-width) solid var(--ds-color-border-1);
		vertical-align: top;
		line-height: var(--ds-leading-normal);
	}

	.processors th {
		font-weight: var(--ds-weight-semibold);
		color: var(--ds-color-ink-2);
		background: var(--ds-color-hover);
		white-space: nowrap;
	}

	.processors tbody tr:last-child td {
		border-bottom: none;
	}

	.processors td:first-child {
		white-space: nowrap;
		color: var(--ds-color-ink-1);
	}

	.email-img {
		display: block;
		width: 15rem;
		max-width: 100%;
		height: auto;
	}

	.revision {
		font-size: var(--ds-text-xs);
		color: var(--ds-color-ink-4);
	}
</style>
