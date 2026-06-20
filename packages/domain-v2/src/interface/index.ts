import type { FermentationRequest, FermentationResult } from '../types';

import { FermentationService } from '../application';

/**
 * Interface 계층(Controller) — 외부 요청을 받아 알맞은 응용 서비스로 라우팅한다.
 * 발효주는 ferment()로, 담금주(침출주)는 추후 infuse() 등으로 평행하게 늘린다.
 */
export class LiquorController {
	private readonly fermentationService = new FermentationService();

	/** 발효주 빚기 요청을 발효주 응용 서비스로 라우팅한다. */
	ferment(request: FermentationRequest): FermentationResult {
		return this.fermentationService.simulate(request);
	}
}
