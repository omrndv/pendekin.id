<?php

namespace App\Events;

use App\DTOs\ClickDataDTO;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LinkClicked
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public ClickDataDTO $clickData
    ) {}
}
