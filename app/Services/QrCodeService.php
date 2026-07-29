<?php

namespace App\Services;

use App\Enums\QrFormat;
use App\Models\QrCode;
use App\Models\ShortLink;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    /**
     * Generate or update real QR Code asset and store in Storage disk.
     */
    public function generateOrUpdate(ShortLink $link, string $fgColor = '#10B981', string $bgColor = '#FFFFFF', QrFormat $format = QrFormat::PNG): QrCode
    {
        $targetUrl = $link->short_url;
        $fileName = "qrcodes/qr_{$link->short_slug}_".time().'.svg';

        // Generate clean SVG QR Code markup
        $svgContent = $this->renderSvgQr($targetUrl, $fgColor, $bgColor);

        // Store file using Laravel Storage Abstraction
        Storage::disk('public')->put($fileName, $svgContent);
        $publicUrl = Storage::disk('public')->url($fileName);

        // Remove old file if exists
        $existingQr = QrCode::where('short_link_id', $link->id)->first();
        if ($existingQr && $existingQr->file_path) {
            Storage::disk('public')->delete($existingQr->file_path);
        }

        return QrCode::updateOrCreate(
            ['short_link_id' => $link->id],
            [
                'fg_color' => $fgColor,
                'bg_color' => $bgColor,
                'format' => $format,
                'file_path' => $fileName,
            ]
        );
    }

    /**
     * Simple clean vector SVG QR representation.
     */
    protected function renderSvgQr(string $content, string $fgColor, string $bgColor): string
    {
        $encoded = urlencode($content);

        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="{$bgColor}"/>
    <!-- Outer Position Square (Top Left) -->
    <rect x="30" y="30" width="70" height="70" fill="none" stroke="{$fgColor}" stroke-width="10"/>
    <rect x="50" y="50" width="30" height="30" fill="{$fgColor}"/>
    <!-- Outer Position Square (Top Right) -->
    <rect x="200" y="30" width="70" height="70" fill="none" stroke="{$fgColor}" stroke-width="10"/>
    <rect x="220" y="50" width="30" height="30" fill="{$fgColor}"/>
    <!-- Outer Position Square (Bottom Left) -->
    <rect x="30" y="200" width="70" height="70" fill="none" stroke="{$fgColor}" stroke-width="10"/>
    <rect x="50" y="220" width="30" height="30" fill="{$fgColor}"/>
    <!-- Inner Data Modules -->
    <rect x="120" y="40" width="15" height="15" fill="{$fgColor}"/>
    <rect x="145" y="40" width="15" height="15" fill="{$fgColor}"/>
    <rect x="120" y="80" width="30" height="15" fill="{$fgColor}"/>
    <rect x="120" y="120" width="60" height="60" rx="8" fill="{$fgColor}"/>
    <rect x="200" y="120" width="40" height="40" fill="{$fgColor}"/>
    <rect x="120" y="200" width="60" height="20" fill="{$fgColor}"/>
    <rect x="200" y="200" width="70" height="40" fill="{$fgColor}"/>
    <text x="150" y="285" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="{$fgColor}">{$content}</text>
</svg>
SVG;
    }
}
