<?php

namespace App\Http\Controllers;

use App\Models\AbuseReport;
use App\Models\ShortLink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Show public form to report a link.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Public/ReportLink', [
            'slug' => $request->query('slug', ''),
        ]);
    }

    /**
     * Store the public abuse report.
     */
    public function store(Request $request)
    {
        $request->validate([
            'slug' => ['required', 'string', 'exists:short_links,short_slug'],
            'reporter_email' => ['required', 'email', 'max:255'],
            'reason' => ['required', 'string', 'in:Phishing,Scam,Malware,Spam,Adult,Violence,Copyright,Fake News,Other'],
            'severity' => ['required', 'string', 'in:low,medium,high,critical'],
            'description' => ['nullable', 'string', 'max:2000'],
            'screenshot' => ['nullable', 'image', 'max:5120'], // Max 5MB
        ]);

        $link = ShortLink::where('short_slug', $request->slug)->firstOrFail();

        $screenshotPath = null;
        if ($request->hasFile('screenshot')) {
            $file = $request->file('screenshot');
            $originalPath = $file->getRealPath();
            
            // Generate a unique filename and path
            $filename = uniqid('report_') . '.jpg';
            $destinationDir = storage_path('app/public/abuse_reports');
            
            // Create directory if not exists
            if (!file_exists($destinationDir)) {
                mkdir($destinationDir, 0755, true);
            }
            
            $destinationPath = $destinationDir . '/' . $filename;
            
            // Compress image using GD to Jpeg with quality 75 and max dimension 1200px
            if ($this->compressImage($originalPath, $destinationPath, 75)) {
                $screenshotPath = 'abuse_reports/' . $filename;
            } else {
                // Fallback if GD compression fails
                $screenshotPath = $file->store('abuse_reports', 'public');
            }
        }

        AbuseReport::create([
            'short_link_id' => $link->id,
            'reporter_email' => $request->reporter_email,
            'reason' => $request->reason,
            'severity' => $request->severity,
            'description' => $request->description,
            'screenshot_path' => $screenshotPath,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('flash', [
            'success' => 'Terima kasih atas laporan Anda. Tim kami akan segera meninjau tautan tersebut.',
        ]);
    }

    /**
     * Compress and convert image to JPG using GD extension.
     */
    private function compressImage(string $sourcePath, string $destinationPath, int $quality = 75): bool
    {
        try {
            $info = getimagesize($sourcePath);
            if (!$info) {
                return false;
            }

            $mime = $info['mime'];

            // Create image resource based on mime type
            switch ($mime) {
                case 'image/jpeg':
                case 'image/jpg':
                    $image = imagecreatefromjpeg($sourcePath);
                    break;
                case 'image/png':
                    $image = imagecreatefrompng($sourcePath);
                    break;
                case 'image/gif':
                    $image = imagecreatefromgif($sourcePath);
                    break;
                case 'image/webp':
                    if (function_exists('imagecreatefromwebp')) {
                        $image = imagecreatefromwebp($sourcePath);
                    } else {
                        return false;
                    }
                    break;
                default:
                    return false;
            }

            if (!$image) {
                return false;
            }

            // Downscale image if it is too large (e.g. wider/higher than 1200px)
            $width = imagesx($image);
            $height = imagesy($image);
            $maxDim = 1200;

            if ($width > $maxDim || $height > $maxDim) {
                if ($width > $height) {
                    $newWidth = $maxDim;
                    $newHeight = (int) ($height * ($maxDim / $width));
                } else {
                    $newHeight = $maxDim;
                    $newWidth = (int) ($width * ($maxDim / $height));
                }
                
                $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
                
                // Keep transparency configurations if any
                if ($mime == 'image/png' || $mime == 'image/gif') {
                    imagealphablending($resizedImage, false);
                    imagesavealpha($resizedImage, true);
                    $transparent = imagecolorallocatealpha($resizedImage, 255, 255, 255, 127);
                    imagefilledrectangle($resizedImage, 0, 0, $newWidth, $newHeight, $transparent);
                }
                
                imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($image);
                $image = $resizedImage;
            }

            // Save image as JPEG with defined quality (quality 75 reduces size massively to ~100-300kb)
            $result = imagejpeg($image, $destinationPath, $quality);
            imagedestroy($image);

            return $result;
        } catch (\Throwable $e) {
            return false;
        }
    }
}
