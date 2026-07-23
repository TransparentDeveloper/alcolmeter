import type { MakgeolliRequest, MakgeolliResult, CiderRequest, CiderResult } from '../types';

import { MakgeolliService, CiderService } from '../application';

/**
 * Interface 계층(Controller) — 외부 요청을 받아 알맞은 응용 서비스로 라우팅한다.
 * 막걸리는 makgeolli()로, 사이다는 cider()로. 다른 술은 추후 평행하게 늘린다.
 */
export class LiquorController {
	private readonly makgeolliService = new MakgeolliService();
	private readonly ciderService = new CiderService();

	/** 막걸리 빚기 요청을 막걸리 서비스로 라우팅한다. */
	makgeolli(request: MakgeolliRequest): MakgeolliResult {
		return this.makgeolliService.brew(request);
	}

	/** 사이다 빚기 요청을 사이다 서비스로 라우팅한다. */
	cider(request: CiderRequest): CiderResult {
		return this.ciderService.brew(request);
	}
}
