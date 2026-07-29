<?php

namespace App\Http\Controllers\User;

use App\DTOs\CreateLinkDTO;
use App\DTOs\UpdateLinkDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLinkRequest;
use App\Http\Requests\UpdateLinkRequest;
use App\Http\Resources\ShortLinkResource;
use App\Models\ShortLink;
use App\Services\LinkService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LinkController extends Controller
{
    public function __construct(
        protected LinkService $linkService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $perPage = (int) $request->input('per_page', 10);

        $paginated = $this->linkService->getUserLinks(
            userId: $request->user()->id,
            perPage: $perPage,
            search: $search,
            status: $status
        );

        return Inertia::render('Dashboard/Links', [
            'links' => ShortLinkResource::collection($paginated),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    public function store(StoreLinkRequest $request): RedirectResponse
    {
        $dto = CreateLinkDTO::fromRequest($request, $request->user()->id);
        $link = $this->linkService->createLink($dto);

        return redirect()->back()->with('flash', [
            'success' => "Short link '{$link->short_slug}' berhasil dibuat!",
        ]);
    }

    public function update(UpdateLinkRequest $request, ShortLink $link): RedirectResponse
    {
        $this->authorize('update', $link);

        $dto = UpdateLinkDTO::fromRequest($request);
        $this->linkService->updateLink($link, $dto);

        return redirect()->back()->with('flash', [
            'success' => "Short link '{$link->short_slug}' berhasil diperbarui.",
        ]);
    }

    public function destroy(ShortLink $link): RedirectResponse
    {
        $this->authorize('delete', $link);

        $slug = $link->short_slug;
        $this->linkService->deleteLink($link);

        return redirect()->back()->with('flash', [
            'success' => "Link '{$slug}' berhasil diarsipkan (soft deleted).",
        ]);
    }

    public function restore(int $id): RedirectResponse
    {
        $this->linkService->restoreLink($id);

        return redirect()->back()->with('flash', [
            'success' => 'Link berhasil dipulihkan kembali.',
        ]);
    }

    public function toggleStatus(ShortLink $link): RedirectResponse
    {
        $this->authorize('update', $link);

        $this->linkService->toggleStatus($link);

        return redirect()->back()->with('flash', [
            'success' => "Status link '{$link->short_slug}' berhasil diubah.",
        ]);
    }
}
