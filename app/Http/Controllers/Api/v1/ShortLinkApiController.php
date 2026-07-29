<?php

namespace App\Http\Controllers\Api\v1;

use App\DTOs\CreateLinkDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLinkRequest;
use App\Http\Resources\ShortLinkResource;
use App\Services\LinkService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShortLinkApiController extends Controller
{
    public function __construct(
        protected LinkService $linkService
    ) {}

    /**
     * Get paginated links for authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $links = $this->linkService->getUserLinks(
            userId: $request->user()->id,
            perPage: (int) $request->input('per_page', 15),
            search: $request->input('search'),
            status: $request->input('status')
        );

        return ApiResponse::success(
            ShortLinkResource::collection($links)->response()->getData(true)['data'],
            'Berhasil mengambil daftar short link.',
            200,
            ['pagination' => [
                'current_page' => $links->currentPage(),
                'last_page' => $links->lastPage(),
                'total' => $links->total(),
            ]]
        );
    }

    /**
     * Store new short link via API.
     */
    public function store(StoreLinkRequest $request): JsonResponse
    {
        $dto = CreateLinkDTO::fromRequest($request, $request->user()->id);
        $link = $this->linkService->createLink($dto);

        return ApiResponse::success(
            new ShortLinkResource($link),
            'Short link berhasil dibuat.',
            201
        );
    }

    /**
     * Show single link details by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $link = $this->linkService->resolveActiveLink($slug);

        return ApiResponse::success(new ShortLinkResource($link));
    }

    /**
     * Delete (archive) short link.
     */
    public function destroy(Request $request, string $slug): JsonResponse
    {
        $link = $this->linkService->resolveActiveLink($slug);
        $this->authorize('delete', $link);

        $this->linkService->deleteLink($link);

        return ApiResponse::success(null, "Short link '{$slug}' berhasil diarsipkan.");
    }
}
