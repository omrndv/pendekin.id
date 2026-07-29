<?php

namespace App\Listeners;

use App\Events\LinkClicked;
use App\Jobs\ProcessClickAnalyticsJob;

class RecordClickAnalyticsListener
{
    public function handle(LinkClicked $event): void
    {
        ProcessClickAnalyticsJob::dispatch($event->clickData);
    }
}
