<?php

namespace App\Support;

class UrlSanitizer
{
    /**
     * Normalize and sanitize a destination URL.
     */
    public static function normalize(string $url): string
    {
        $url = trim($url);

        // Prepend https:// if no protocol is supplied
        if (! preg_match('~^(?:f|ht)tps?://~i', $url)) {
            $url = 'https://'.$url;
        }

        // Parse and rebuild URL cleanly
        $parts = parse_url($url);

        if (! $parts || empty($parts['host'])) {
            return $url;
        }

        $scheme = strtolower($parts['scheme'] ?? 'https');
        $host = strtolower($parts['host']);
        $port = isset($parts['port']) ? ':'.$parts['port'] : '';
        $path = $parts['path'] ?? '';
        $query = isset($parts['query']) ? '?'.$parts['query'] : '';
        $fragment = isset($parts['fragment']) ? '#'.$parts['fragment'] : '';

        return "{$scheme}://{$host}{$port}{$path}{$query}{$fragment}";
    }

    /**
     * Check if the URL host is safe and not pointing to dangerous local loopbacks.
     */
    public static function isSafe(string $url): bool
    {
        $parts = parse_url($url);
        if (! $parts || empty($parts['host'])) {
            return false;
        }

        $host = strtolower($parts['host']);

        // Block internal loopback IPs to prevent SSRF
        $blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
        if (in_array($host, $blockedHosts, true)) {
            return false;
        }

        return true;
    }
}
