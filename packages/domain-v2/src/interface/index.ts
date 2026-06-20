import type { MakgeolliRequest, MakgeolliResult } from '../types';

import { MakgeolliService } from '../application';

/**
 * Interface 계층(Controller) — 외부 요청을 받아 알맞은 응용 서비스로 라우팅한다.
 * 막걸리는 makgeolli()로. 다른 술(청주·증류주 등)은 추후 평행하게 늘린다.
 */
export class LiquorController {
	private readonly makgeolliService = new MakgeolliService();

	/** 막걸리 빚기 요청을 막걸리 서비스로 라우팅한다. */
	makgeolli(request: MakgeolliRequest): MakgeolliResult {
		return this.makgeolliService.brew(request);
	}
}
